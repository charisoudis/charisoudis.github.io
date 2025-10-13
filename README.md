
# al-folio · React (Next.js)

A Next.js starter that mirrors **al-folio** structure and aesthetics, but with a modern React stack:
- MDX + Contentlayer for content
- Publications rendered directly from a **BibTeX** file
- CV rendered from **resume.json** (JSON Resume format)
- Notable Projects as MDX entries (with embedded React/3D viewers)
- GitHub **Repos** page with stats and repositories
- TailwindCSS styling (al-folio inspired)
- Dark mode with `next-themes`
- Ready slot for your WebGL/R3F 3D components

## Quickstart

```bash
pnpm i # or npm i / yarn
pnpm dev
```

Then open http://localhost:3000.

### Content you’ll edit

- **Publications:** `content/publications/pubs.bib`
- **CV:** `content/cv/resume.json` (JSON Resume schema)
- **Projects:** `content/projects/*.mdx` (frontmatter + MDX body)
- **Site config:** `src/site.config.ts` (name, socials, GitHub username)

### Embed your 3D components

Replace `src/components/ModelViewer.tsx` with your React Three Fiber viewer and import it in MDX:

```mdx
import dynamic from 'next/dynamic'
const ModelViewer = dynamic(() => import('@/components/ModelViewer'), { ssr: false })

<ModelViewer src="/models/scene.glb" />
```

The Projects page uses Contentlayer, so you can place `.mdx` files under `content/projects` and include your viewer inline.

### GitHub stats

Set your username in `src/site.config.ts`:
```ts
export const site = { github: 'your-github-username' }
```

Optionally set `GITHUB_TOKEN` in `.env.local` for higher API rate limits.

### Build

```bash
pnpm build && pnpm start
```

### Notes

- Citations in MDX are supported via `rehype-citation` wired to `content/publications/pubs.bib`. The Publications page itself parses the BibTeX and renders a full list grouped by year.
- The visual style aims to be clean, serif headings, subtle borders/shadows—similar to al-folio.
