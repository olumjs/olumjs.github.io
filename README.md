# olumjs.github.io

The official website for [Olum](https://github.com/olumjs) — a signal-based JavaScript framework built for rapid prototyping and hackathons.

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/
  page.tsx          # Landing page
  layout.tsx        # Root layout
  docs/             # Documentation pages
  blog/             # Blog pages
components/         # Section and UI components
lib/
  data.ts           # Shared constants
  blog-posts.ts     # Blog post metadata
  highlight.tsx     # Syntax highlighting
public/             # Static assets (logo, icons)
```

## About Olum

Olum is a lightweight frontend framework with signal-based reactivity and single-file components. Get started with:

```bash
npx create-olum@latest my-app
```

Full docs at [olumjs.github.io/docs](https://olumjs.github.io/docs).
