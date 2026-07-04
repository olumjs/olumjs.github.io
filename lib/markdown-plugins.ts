import { visit } from "unist-util-visit";
import type { Root } from "mdast";

// Carry a fenced block's language + `title="…"` meta onto the <code> element so
// the renderer can feed them to <CodeBlock>. Only runs on block code (`code`),
// not inline code (`inlineCode`).
export function remarkCodeMeta() {
  return (tree: Root) => {
    visit(tree, "code", (node) => {
      const meta = node.meta ?? "";
      const title = /title="([^"]*)"/.exec(meta)?.[1] ?? "";
      const data = (node.data ??= {});
      data.hProperties = {
        ...(data.hProperties ?? {}),
        dataTitle: title,
        dataLang: node.lang ?? "",
      };
    });
  };
}

// Turn container directives (`:::tip[Label]{icon="🔒"}`) into a <div> the
// renderer maps to a Callout. The `[Label]` becomes data-label, `{icon}` data-icon.
export function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, (node: any) => {
      if (node.type !== "containerDirective") return;

      let label = "";
      node.children = (node.children ?? []).filter((child: any) => {
        if (child.data?.directiveLabel) {
          label = child.children?.map((c: any) => c.value ?? "").join("") ?? "";
          return false;
        }
        return true;
      });

      const data = (node.data ??= {});
      data.hName = "div";
      data.hProperties = {
        className: ["callout"],
        dataCallout: node.name,
        dataIcon: node.attributes?.icon ?? "",
        dataLabel: label,
      };
    });
  };
}
