"use client";
import { useState, type ReactNode } from "react";
import { Highlight } from "@/lib/highlight";
import { CopyButton } from "@/components/CopyButton";

/* ─── Public types ──────────────────────────────────────────── */
export type IDEFile = {
  name: string;       // supports paths: "src/App.html", "public/index.html"
  code: string;
  icon?: ReactNode;
};

export type IDEProps = {
  projectName?: string;
  files: IDEFile[];
  preview?: ReactNode;
  defaultView?: "preview" | "code";
  defaultFile?: string;   // full path e.g. "src/TodoList.html"
  repoUrl?: string;       // links the project name in the breadcrumb to the source
};

/* ─── Internal tree ─────────────────────────────────────────── */
type TreeNode = {
  name: string;
  fullPath: string;
  children: TreeNode[];
  file?: IDEFile;   // only on leaf nodes
};

function buildTree(files: IDEFile[]): TreeNode[] {
  const root: TreeNode[] = [];
  for (const file of files) {
    const parts = file.name.split("/");
    let nodes = root;
    let pathSoFar = "";
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      pathSoFar = pathSoFar ? `${pathSoFar}/${part}` : part;
      const isLast = i === parts.length - 1;
      let node = nodes.find(n => n.name === part);
      if (!node) {
        node = { name: part, fullPath: pathSoFar, children: [] };
        nodes.push(node);
      }
      if (isLast) node.file = file;
      nodes = node.children;
    }
  }
  return root;
}

function collectAllFolders(nodes: TreeNode[], set: Set<string>) {
  for (const n of nodes) {
    if (n.children.length > 0) {
      set.add(n.fullPath);
      collectAllFolders(n.children, set);
    }
  }
}

/* ─── Icon helpers ──────────────────────────────────────────── */
function resolvePublicIcon(name: string): string | null {
  const filename = name.split("/").pop()!;
  const lower    = filename.toLowerCase();
  const ext      = lower.includes(".") ? lower.split(".").pop()! : "";

  // name-based checks first (before extension fallbacks)
  if (lower.includes("tailwind"))                                             return "/icons/tailwindcss.svg";
  if (lower.includes("node") || lower === "package.json" || lower === "package-lock.json") return "/icons/nodejs.svg";
  if (lower.startsWith(".git") || ext === "gitignore" || ext === "gitattributes") return "/icons/git.svg";
  if (ext === "md" || ext === "mdx" || lower.startsWith("readme"))           return "/icons/readme.svg";

  // extension-based checks
  if (ext === "ts" || ext === "tsx")                                         return "/icons/typescript.svg";
  if (ext === "js" || ext === "jsx" || ext === "mjs" || ext === "cjs")       return "/icons/javascript.svg";
  if (ext === "html" || ext === "htm")                                        return "/icons/html.svg";
  if (ext === "css")                                                          return "/icons/css.svg";
  if (ext === "svg")                                                          return "/icons/svg.svg";
  return null;
}

function FolderIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0" style={{ color: "#e8b84b" }}>
      <path d="M2 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v1H2V6z" fill="currentColor" opacity="0.85" />
      <path d="M2 11h20l-2 9H4L2 11z" fill="currentColor" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0" style={{ color: "#e8b84b" }}>
      <path d="M2 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" fill="currentColor" />
    </svg>
  );
}

function DefaultFileIcon({ name }: { name: string }) {
  const filename = name.split("/").pop()!;
  const ext      = filename.includes(".") ? filename.split(".").pop()! : "";

  const publicIcon = resolvePublicIcon(name);
  if (publicIcon) return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={publicIcon} width={16} height={16} alt={ext} aria-hidden="true" className="shrink-0" />
  );

  if (ext === "olum") return (
    <svg width="16" height="16" viewBox="0 0 13 13" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="0"   y="0"   width="4.2" height="13"  rx="0.8" fill="#25C97E" />
      <rect x="0"   y="0"   width="13"  height="4.2" rx="0.8" fill="#25C97E" />
      <rect x="8.8" y="8.8" width="4.2" height="4.2" rx="0.8" fill="#25C97E" />
    </svg>
  );

  return (
    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M1 1h6l3 3v8a1 1 0 01-1 1H1a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="var(--fg-subtle)" strokeWidth="1.2" fill="none" />
      <path d="M7 1v3h3" stroke="var(--fg-subtle)" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function FileIcon({ file }: { file: IDEFile }) {
  if (file.icon) return <span className="shrink-0">{file.icon}</span>;
  return <DefaultFileIcon name={file.name} />;
}

/* ─── Recursive tree node ───────────────────────────────────── */
function FileTreeNode({
  node,
  depth,
  activeFile,
  openFolders,
  onToggleFolder,
  onSelectFile,
}: {
  node: TreeNode;
  depth: number;
  activeFile: IDEFile;
  openFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  onSelectFile: (file: IDEFile) => void;
}) {
  const isFolder = node.children.length > 0;
  const isOpen   = openFolders.has(node.fullPath);
  const isActive = !isFolder && !!node.file && activeFile.name === node.file.name;

  return (
    <div>
      <button
        onClick={() => isFolder ? onToggleFolder(node.fullPath) : node.file && onSelectFile(node.file)}
        className={`w-full flex items-center gap-1.5 py-[3px] rounded-md text-left text-[11px] font-mono transition-colors ${
          isActive
            ? "bg-[rgba(37,201,126,0.1)] text-[#25C97E]"
            : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--hover-overlay)]"
        }`}
        style={{ paddingLeft: `${6 + depth * 12}px`, paddingRight: 6 }}
      >
        {isFolder ? (
          <>
            <svg
              width="7" height="7" viewBox="0 0 7 7" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              aria-hidden="true" className="shrink-0 transition-transform duration-150"
              style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              <path d="M1.5 1l3 2.5-3 2.5" />
            </svg>
            <FolderIcon open={isOpen} />
          </>
        ) : (
          <>
            <span className="w-[7px] shrink-0" />
            {node.file && <FileIcon file={node.file} />}
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>

      {isFolder && isOpen && (
        <div>
          {node.children.map(child => (
            <FileTreeNode
              key={child.fullPath}
              node={child}
              depth={depth + 1}
              activeFile={activeFile}
              openFolders={openFolders}
              onToggleFolder={onToggleFolder}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Mini IDE shell ────────────────────────────────────────── */
export default function MiniIDE({
  projectName = "project",
  files,
  preview,
  defaultView = "preview",
  defaultFile,
  repoUrl,
}: IDEProps) {
  const first = defaultFile
    ? (files.find(f => f.name === defaultFile) ?? files[0])
    : files[0];

  const tree = buildTree(files);

  const [activeFile, setActiveFile] = useState<IDEFile>(first);
  const [view, setView]             = useState<"preview" | "code">(
    preview ? defaultView : "code"
  );
  const [openFolders, setOpenFolders] = useState<Set<string>>(() => {
    const set = new Set<string>();
    collectAllFolders(tree, set);
    return set;
  });

  const toggleFolder = (path: string) =>
    setOpenFolders(prev => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });

  const switchToFile = (file: IDEFile) => { setActiveFile(file); setView("code"); };

  const tabs: Array<"preview" | "code"> = preview ? ["preview", "code"] : ["code"];

  const pathParts  = activeFile.name.split("/");
  const activeBase = pathParts[pathParts.length - 1];

  return (
    <div
      className="rounded-2xl overflow-hidden border border-[var(--border)]"
      style={{ background: "var(--card)", boxShadow: "0 0 0 1px rgba(37,201,126,0.06), 0 24px 64px rgba(0,0,0,0.4)" }}
    >
      {/* ── Title bar ───────────────────────────────────────── */}
      <div
        className="flex items-center justify-between gap-4 px-4 h-11 border-b border-[var(--border)] shrink-0"
        style={{ background: "var(--surface)" }}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
        </div>

        {/* Breadcrumb */}
        <span className="text-[11px] font-mono text-[var(--fg-subtle)] truncate flex items-center gap-0.5">
          <span>{projectName}</span>
          {view === "preview" ? (
            <><span className="opacity-30 mx-1">/</span><span className="text-[var(--fg-2)]">preview</span></>
          ) : (
            pathParts.map((part, i) => (
              <span key={i} className="flex items-center gap-0.5">
                <span className="opacity-30 mx-1">/</span>
                <span className={i === pathParts.length - 1 ? "text-[var(--fg-2)]" : ""}>{part}</span>
              </span>
            ))
          )}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          {/* View toggle */}
          {tabs.length > 1 && (
            <div
              className="flex items-center gap-0.5 p-1 rounded-lg border border-[var(--border)] bg-[var(--bg)]"
              role="tablist" aria-label="View mode"
            >
              {tabs.map(v => (
                <button
                  key={v}
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => setView(v)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs capitalize transition-all duration-150 ${
                    view === v
                      ? "bg-[var(--surface)] text-[var(--fg)] shadow-sm"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg-2)]"
                  }`}
                >
                  {v === "preview" ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                    </svg>
                  ) : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                    </svg>
                  )}
                  {v}
                </button>
              ))}
            </div>
          )}

          {/* Source link */}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View source on GitHub"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--fg-muted)] hover:text-[#25C97E] transition-colors duration-150"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Source
            </a>
          )}
        </div>
      </div>

      {/* ── IDE body ────────────────────────────────────────── */}
      <div className="flex" style={{ minHeight: 520 }}>

        {/* Sidebar */}
        <aside
          className="hidden sm:flex flex-col w-44 xl:w-52 shrink-0 border-r border-[var(--border)]"
          style={{ background: "var(--surface)" }}
        >
          <div className="px-4 pt-3 pb-1.5">
            <p className="text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
              Explorer
            </p>
          </div>

          <div className="px-2 flex-1 overflow-y-auto">
            {/* Root row */}
            <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-[var(--fg-2)] select-none">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M1 2l3 3 3-3" />
              </svg>
              {projectName}
            </div>

            {/* Tree */}
            <div className="mt-0.5 pb-2">
              {tree.map(node => (
                <FileTreeNode
                  key={node.fullPath}
                  node={node}
                  depth={1}
                  activeFile={activeFile}
                  openFolders={openFolders}
                  onToggleFolder={toggleFolder}
                  onSelectFile={switchToFile}
                />
              ))}
            </div>
          </div>

          {/* Docs link */}
          <div className="px-4 py-3 border-t border-[var(--border-subtle)]">
            <a
              href="/docs"
              className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--fg-subtle)] hover:text-[#25C97E] transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Read the docs →
            </a>
          </div>
        </aside>

        {/* Main panel */}
        <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
          {view === "preview" && preview ? (
            <div className="flex-1 overflow-y-auto">{preview}</div>
          ) : (
            <>
              {/* Toolbar */}
              <div
                className="flex items-center justify-between px-4 h-9 border-b border-[var(--border)] shrink-0"
                style={{ background: "var(--surface-2)" }}
              >
                <div className="flex items-center gap-2">
                  <FileIcon file={activeFile} />
                  <span className="text-[11px] font-mono text-[var(--fg-2)]">{activeBase}</span>
                </div>
                <CopyButton text={activeFile.code} />
              </div>

              {/* Code */}
              <div className="flex-1 overflow-auto bg-[var(--bg)]">
                <div className="flex">
                  <div
                    className="select-none text-right py-5 px-3 text-[13px] font-mono leading-6 shrink-0 text-[var(--fg-subtle)]"
                    style={{ borderRight: "1px solid var(--border)", minWidth: 44 }}
                    aria-hidden="true"
                  >
                    {activeFile.code.split("\n").map((_, i) => <div key={i}>{i + 1}</div>)}
                  </div>
                  <div className="flex-1 overflow-x-auto py-5 px-5">
                    <pre className="font-mono text-[13px] leading-6 text-[var(--fg)]">
                      <Highlight code={activeFile.code} />
                    </pre>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
