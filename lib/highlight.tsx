import React from "react";

const COLORS: Record<string, string> = {
  keyword:  "#c084fc", // soft purple
  string:   "#25C97E",
  comment:  "#6b7280", // gray
  number:   "#fb923c", // orange
  type:     "#fbbf24", // gold — capitalized names
  fn:       "#60a5fa", // blue — function calls
  tag:      "#60a5fa", // blue — html tag names
  attr:     "#fbbf24", // gold — html attribute names
  punct:    "#94a3b8", // slate — html punctuation (< > / =)
  plain:    "#e2e8f0", // light gray
};

interface Token {
  text: string;
  type: string;
}

const KEYWORDS = new Set([
  "import","export","from","default","const","let","var","function","return",
  "if","else","for","while","do","switch","case","break","continue","class",
  "extends","new","this","super","type","interface","async","await","of","in",
  "null","undefined","true","false","void","typeof","instanceof","try","catch",
  "throw","finally","use","with",
]);

// ── JavaScript / TypeScript ─────────────────────────────────────────────────

function tokenizeJS(code: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;

  function addPlain(ch: string) {
    const last = tokens[tokens.length - 1];
    if (last?.type === "plain") {
      last.text += ch;
    } else {
      tokens.push({ text: ch, type: "plain" });
    }
  }

  while (pos < code.length) {
    const remaining = code.slice(pos);

    // Single-line comment
    if (remaining.startsWith("//")) {
      const end = remaining.indexOf("\n");
      const text = end === -1 ? remaining : remaining.slice(0, end);
      tokens.push({ text, type: "comment" });
      pos += text.length;
      continue;
    }

    // Multi-line comment
    if (remaining.startsWith("/*")) {
      const end = remaining.indexOf("*/");
      const text = end === -1 ? remaining : remaining.slice(0, end + 2);
      tokens.push({ text, type: "comment" });
      pos += text.length;
      continue;
    }

    // HTML comment
    if (remaining.startsWith("<!--")) {
      const end = remaining.indexOf("-->");
      const text = end === -1 ? remaining : remaining.slice(0, end + 3);
      tokens.push({ text, type: "comment" });
      pos += text.length;
      continue;
    }

    // Template literal
    if (remaining[0] === "`") {
      const m = remaining.match(/^(`(?:[^`\\]|\\.)*`)/s);
      if (m) { tokens.push({ text: m[1], type: "string" }); pos += m[1].length; continue; }
    }

    // String double-quote
    if (remaining[0] === '"') {
      const m = remaining.match(/^("(?:[^"\\]|\\.)*")/);
      if (m) { tokens.push({ text: m[1], type: "string" }); pos += m[1].length; continue; }
    }

    // String single-quote
    if (remaining[0] === "'") {
      const m = remaining.match(/^('(?:[^'\\]|\\.)*')/);
      if (m) { tokens.push({ text: m[1], type: "string" }); pos += m[1].length; continue; }
    }

    // Number
    const numM = remaining.match(/^(\b\d+(?:\.\d+)?\b)/);
    if (numM) { tokens.push({ text: numM[1], type: "number" }); pos += numM[1].length; continue; }

    // Word (keyword, type, function, or plain identifier)
    const wordM = remaining.match(/^([A-Za-z_$][A-Za-z0-9_$]*)/);
    if (wordM) {
      const word = wordM[1];
      let type = "plain";
      if (KEYWORDS.has(word)) {
        type = "keyword";
      } else if (/^[A-Z]/.test(word)) {
        type = "type";
      } else {
        // check if followed by (
        const after = remaining.slice(word.length).trimStart();
        if (after[0] === "(") type = "fn";
      }
      tokens.push({ text: word, type });
      pos += word.length;
      continue;
    }

    addPlain(code[pos]);
    pos++;
  }

  return tokens;
}

// ── CSS (for embedded <style> blocks) ───────────────────────────────────────

function tokenizeCSS(code: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;

  function addPlain(ch: string) {
    const last = tokens[tokens.length - 1];
    if (last?.type === "plain") last.text += ch;
    else tokens.push({ text: ch, type: "plain" });
  }

  while (pos < code.length) {
    const remaining = code.slice(pos);

    // Comment
    if (remaining.startsWith("/*")) {
      const end = remaining.indexOf("*/");
      const text = end === -1 ? remaining : remaining.slice(0, end + 2);
      tokens.push({ text, type: "comment" });
      pos += text.length;
      continue;
    }

    // Strings
    if (remaining[0] === '"' || remaining[0] === "'") {
      const q = remaining[0];
      const m = remaining.match(q === '"' ? /^"[^"]*"/ : /^'[^']*'/);
      if (m) { tokens.push({ text: m[0], type: "string" }); pos += m[0].length; continue; }
    }

    // Hex color
    const hexM = remaining.match(/^#[0-9a-fA-F]+/);
    if (hexM) { tokens.push({ text: hexM[0], type: "number" }); pos += hexM[0].length; continue; }

    // Number (with optional unit)
    const numM = remaining.match(/^\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms|fr)?/);
    if (numM) { tokens.push({ text: numM[0], type: "number" }); pos += numM[0].length; continue; }

    addPlain(code[pos]);
    pos++;
  }

  return tokens;
}

// ── HTML (Olum component files) ─────────────────────────────────────────────

// Find the index just past the closing `>` of the tag that starts at index 0,
// respecting quoted attribute values and comments embedded between attributes.
function tagEnd(s: string): number {
  let i = 1; // skip the leading <
  let quote = "";
  while (i < s.length) {
    if (!quote && s.startsWith("<!--", i)) {
      const c = s.indexOf("-->", i);
      i = c === -1 ? s.length : c + 3;
      continue;
    }
    const ch = s[i];
    if (quote) {
      if (ch === quote) quote = "";
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === ">") {
      return i + 1;
    }
    i++;
  }
  return s.length;
}

// Tokenize a single tag string, e.g. `<div class="card">` or `</for>`.
function tokenizeTag(tag: string): Token[] {
  const tokens: Token[] = [];

  const open = tag.match(/^<\/?/)![0];
  tokens.push({ text: open, type: "punct" });
  let rest = tag.slice(open.length);

  const nameM = rest.match(/^[A-Za-z][A-Za-z0-9-]*/);
  if (nameM) {
    tokens.push({ text: nameM[0], type: "tag" });
    rest = rest.slice(nameM[0].length);
  }

  while (rest.length) {
    // Comment embedded between attributes
    if (rest.startsWith("<!--")) {
      const e = rest.indexOf("-->");
      const text = e === -1 ? rest : rest.slice(0, e + 3);
      tokens.push({ text, type: "comment" });
      rest = rest.slice(text.length);
      continue;
    }
    // Closing > or />
    const closeM = rest.match(/^\s*\/?>/);
    if (closeM) {
      tokens.push({ text: closeM[0], type: "punct" });
      rest = rest.slice(closeM[0].length);
      continue;
    }
    // Whitespace
    const wsM = rest.match(/^\s+/);
    if (wsM) { tokens.push({ text: wsM[0], type: "plain" }); rest = rest.slice(wsM[0].length); continue; }
    // Attribute value string
    if (rest[0] === '"' || rest[0] === "'") {
      const q = rest[0];
      const m = rest.match(q === '"' ? /^"[^"]*"/ : /^'[^']*'/);
      if (m) { tokens.push({ text: m[0], type: "string" }); rest = rest.slice(m[0].length); continue; }
    }
    // Equals sign
    if (rest[0] === "=") { tokens.push({ text: "=", type: "punct" }); rest = rest.slice(1); continue; }
    // Attribute name
    const attrM = rest.match(/^[^\s=/>"']+/);
    if (attrM) { tokens.push({ text: attrM[0], type: "attr" }); rest = rest.slice(attrM[0].length); continue; }

    tokens.push({ text: rest[0], type: "plain" });
    rest = rest.slice(1);
  }

  return tokens;
}

function tokenizeHTML(code: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;

  function addPlain(ch: string) {
    const last = tokens[tokens.length - 1];
    if (last?.type === "plain") last.text += ch;
    else tokens.push({ text: ch, type: "plain" });
  }

  while (pos < code.length) {
    const remaining = code.slice(pos);

    // HTML comment
    if (remaining.startsWith("<!--")) {
      const end = remaining.indexOf("-->");
      const text = end === -1 ? remaining : remaining.slice(0, end + 3);
      tokens.push({ text, type: "comment" });
      pos += text.length;
      continue;
    }

    // Tag
    if (/^<\/?[A-Za-z]/.test(remaining)) {
      const tag = remaining.slice(0, tagEnd(remaining));
      tokens.push(...tokenizeTag(tag));
      pos += tag.length;

      // Embedded <script> / <style> content
      const name = tag.match(/^<([A-Za-z][A-Za-z0-9-]*)/)?.[1].toLowerCase();
      if (name === "script" || name === "style") {
        const inner = code.slice(pos);
        const closeRe = name === "script" ? /<\/script\s*>/i : /<\/style\s*>/i;
        const m = closeRe.exec(inner);
        const body = m ? inner.slice(0, m.index) : inner;
        tokens.push(...(name === "script" ? tokenizeJS(body) : tokenizeCSS(body)));
        pos += body.length;
      }
      continue;
    }

    // Interpolation { expr } in text
    if (remaining[0] === "{") {
      const end = remaining.indexOf("}");
      if (end !== -1) {
        tokens.push({ text: "{", type: "punct" });
        tokens.push(...tokenizeJS(remaining.slice(1, end)));
        tokens.push({ text: "}", type: "punct" });
        pos += end + 1;
        continue;
      }
    }

    addPlain(code[pos]);
    pos++;
  }

  return tokens;
}

// ── Renderer ────────────────────────────────────────────────────────────────

function tokenize(code: string, lang?: string): Token[] {
  if (lang === "html") return tokenizeHTML(code);
  if (lang === "css") return tokenizeCSS(code);
  return tokenizeJS(code);
}

export function Highlight({ code, lang }: { code: string; lang?: string }) {
  const tokens = tokenize(code, lang);
  return (
    <>
      {tokens.map((tok, i) => {
        if (tok.type === "plain") return <span key={i}>{tok.text}</span>;
        return (
          <span
            key={i}
            style={{
              color: COLORS[tok.type] ?? COLORS.plain,
              fontStyle: tok.type === "comment" ? "italic" : undefined,
            }}
          >
            {tok.text}
          </span>
        );
      })}
    </>
  );
}
