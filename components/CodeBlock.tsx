import { Highlight } from "@/lib/highlight";
import { CopyButton } from "@/components/CopyButton";

interface CodeBlockProps {
  code: string;
  filename?: string;
  lang?: string;
  showCopy?: boolean;
}

export function CodeBlock({ code, filename, showCopy = true }: CodeBlockProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#27272a] bg-[#000000]">
      {/* Chrome bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0a0a] border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          {filename && (
            <span className="text-xs text-[#52525b] font-mono">{filename}</span>
          )}
        </div>
        {showCopy && <CopyButton text={code} />}
      </div>
      {/* Code */}
      <div className="overflow-x-auto p-5">
        <pre className="font-mono text-sm leading-6 text-[#e2e8f0]">
          <Highlight code={code} />
        </pre>
      </div>
    </div>
  );
}
