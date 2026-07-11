import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { siteConfig } from "@/lib/site-config";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Referrers from our own pages shouldn't count as a traffic source. Derived from
// the configured site domain, so set NEXT_PUBLIC_SITE_URL to the production URL
// for this filter to be accurate.
const OWN_DOMAINS = [siteConfig.domain];

function stripProtocolAndWww(value: string): string {
  return value.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

function parseUTMSource(url: string): string {
  const source = new URL(url).searchParams.get("utm_source") ?? "";
  return stripProtocolAndWww(source);
}

function parseReferrerSource(referer: string | null, pathname: string): string {
  if (!referer) {
    // No referrer: a genuine "direct" visit (typed the domain / bookmark) lands on
    // the homepage. Nobody types a deep URL from memory, so a no-referrer hit on a
    // deep page is almost always a stripped referrer (in-app browsers, no-referrer
    // policy, https→http) rather than a true type-in.
    return pathname === "/" ? "direct" : "hidden";
  }
  try {
    return stripProtocolAndWww(new URL(referer).hostname);
  } catch {
    return "unknown";
  }
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. UTM takes priority — most reliable
  const utmSource = parseUTMSource(request.nextUrl.toString());
  if (utmSource) {
    response.cookies.set("traffic_source", utmSource, { maxAge: COOKIE_MAX_AGE });
    return response;
  }

  // 2. Fallback to Referer — only if not our own domain
  const referer = request.headers.get("referer");
  const isOwnDomain = OWN_DOMAINS.some((d) => referer?.includes(d));

  if (!isOwnDomain) {
    response.cookies.set("traffic_source", parseReferrerSource(referer, pathname), { maxAge: COOKIE_MAX_AGE });
  }

  return response;
}

// e.g. https://olumjs.top/docs?utm_source=bluesky
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)).*)"],
};
