import React from "react";

const COLORS: Record<string, string> = {
  keyword:  "#c084fc", // soft purple
  string:   "#25C97E",
  comment:  "#6b7280", // gray
  number:   "#fb923c", // orange
  type:     "#fbbf24", // gold — capitalized names
  fn:       "#60a5fa", // blue — function calls
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

function tokenize(code: string): Token[] {
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

export function Highlight({ code }: { code: string }) {
  const tokens = tokenize(code);
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
