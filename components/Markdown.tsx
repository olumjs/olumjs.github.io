import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { remarkCodeMeta, remarkCallouts } from "@/lib/markdown-plugins";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";

const components: Components = {
  // Strip react-markdown's <pre> wrapper — CodeBlock renders its own.
  pre: ({ children }) => <>{children}</>,

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
