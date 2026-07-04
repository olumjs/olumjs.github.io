import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { remarkCodeMeta, remarkCallouts } from "@/lib/markdown-plugins";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { slugify } from "@/lib/utils";

// Recursively read the plain text of a hast node (for building heading ids).
function nodeText(node: unknown): string {
  const n = node as { type?: string; value?: string; children?: unknown[] };
  if (!n) return "";
  if (n.type === "text") return n.value ?? "";
  return (n.children ?? []).map(nodeText).join("");
}

const components: Components = {
  // Strip react-markdown's <pre> wrapper — CodeBlock renders its own.
  pre: ({ children }) => <>{children}</>,

  // Anchor h2 headings so the "On this page" TOC can scroll to them. The id is
  // slugified from the heading text — the same slug extractToc() computes.
  h2: ({ node, children }) => <h2 id={slugify(nodeText(node))}>{children}</h2>,

  code({ node, className, children }) {
    const props = (node?.properties ?? {}) as Record<string, unknown>;
    const lang = (props.dataLang as string) || /language-(\w+)/.exec(className ?? "")?.[1] || "";
    // Block code carries a language (set by remarkCodeMeta); inline code doesn't.
    if (!lang) return <code className="md-code">{children}</code>;
    const title = (props.dataTitle as string) || undefined;
    const code = String(children).replace(/\n$/, "");
    return <CodeBlock code={code} filename={title} lang={lang} showCopy />;
  },

  div({ node, className, children }) {
    const props = (node?.properties ?? {}) as Record<string, unknown>;
    const callout = props.dataCallout as string | undefined;
    if (callout) {
      return (
        <Callout type={callout} icon={props.dataIcon as string} label={props.dataLabel as string}>
          {children}
        </Callout>
      );
    }
    return <div className={className}>{children}</div>;
  },

  a({ href, children }) {
    const external = /^https?:\/\//.test(href ?? "");
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    );
  },
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="docs-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkDirective, remarkCodeMeta, remarkCallouts]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
