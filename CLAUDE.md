# MKS Studio — Claude Reference

Architecture & interior design portfolio for MKS Studio. High-end, animation-heavy, bilingual (EN/RO).

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js (App Router) | ^15.4.9 |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS v4 | 4.1.11 |
| Animation | Framer Motion (`motion/react`) | ^12.38.0 |
| 3D / WebGL | Three.js | ^0.183.2 |
| Icons | lucide-react | ^0.553.0 |
| React | React 19 | ^19.2.1 |

**Important:** Tailwind is v4. It uses `@import "tailwindcss"` in globals.css, NOT the old `@tailwind base/components/utilities` directives. Custom theme tokens live in `@theme {}` blocks. No tailwind.config.js file exists.

---

## Commands

```bash
npm run dev      # local dev — http://localhost:3000
npm run build    # static export to /out (output: 'export' in next.config.ts)
npm run lint     # eslint (errors ignored during builds — see next.config.ts)
```

---

## Key Files & What They Do

```
app/
  layout.tsx                  Root layout: fonts (Inter, Space Grotesk, Playfair), providers
  globals.css                 Tailwind import, @theme fonts, animate-shine keyframe, scrollbar hide
  page.tsx                    Homepage: fullscreen carousel with LiquidImage + slide animation
  projects/
    page.tsx                  Horizontal scroll projects gallery (drag + scroll-linked)
    [id]/
      page.tsx                Server component — reads id param, renders ProjectDetailClient
      ProjectDetailClient.tsx  All project detail UI: hero, info, gallery, drawings, next-project

components/
  LiquidImage.tsx             WebGL cursor-distortion image (Three.js, two-effect architecture)
  TransitionLink.tsx          Page-transition-aware <Link> wrapper
  TransitionProvider.tsx      Framer Motion page transition context
  CustomCursor.tsx            Custom cursor dot + text label
  Loader.tsx                  Intro loading screen (runs once per session via sessionStorage)
  ErrorBoundary.tsx           React error boundary wrapper

lib/
  data.ts                     ALL project data + gallery images. The single source of truth.
  utils.ts                    getPath() — prepends basePath in production
  translations.ts             All EN/RO strings

contexts/
  LanguageContext.tsx         Lang state + t() helper. Persisted to localStorage key "mks-lang"

public/
  logo.png                    Site logo (used inverted/brightened via Tailwind classes)
  projects/<id>/              One folder per project — images + drawings/ subfolder
```

---

## Adding a New Project (Most Common Task)

**Step 1 — Add images to public/**

Create `public/projects/<project-id>/` and drop images in.  
Name them descriptively: `01_hero.jpg`, `02_exterior.png`, etc.  
Add PDFs or image drawings to `public/projects/<project-id>/drawings/`.

**Step 2 — Add the entry to `lib/data.ts`**

Add a new object to the `projects` array (order = display order on homepage carousel and projects page):

```ts
{
  id: "my-project",           // URL slug — must be unique, URL-safe, kebab-case
  title: "MY PROJECT",        // EN title — uppercase by convention
  subtitle: "Short tagline",  // EN subtitle shown below title on carousel
  titleRo: "...",             // RO title (optional but preferred)
  subtitleRo: "...",          // RO subtitle
  descriptionRo: "...",       // RO description — use \n\n for paragraph breaks
  category: "Residential",    // or "Commercial" — displayed as metadata
  date: "2025",               // year string
  size: "200 m²",             // or "—" if unknown
  image: "/projects/my-project/01_hero.jpg",  // hero image shown in carousel
  description: "EN description. Use \\n\\n for paragraph breaks.",
  gallery: [                  // images shown in the project detail gallery section
    "/projects/my-project/01_hero.jpg",
    "/projects/my-project/02_exterior.jpg",
    // .mp4 files are supported and autoplay muted in gallery
  ],
  drawings: [                 // technical docs shown in the Blueprints section (optional)
    "/projects/my-project/drawings/A101-FLOOR PLAN.pdf",
    "/projects/my-project/drawings/09_section.jpg",
  ],
  heroFit: "cover",           // "cover" (default) or "contain" — how image fills carousel slot
}
```

**Step 3 — Add to `galleryImages` array (optional)**

If you want the hero image to appear on the `/gallery` page, add a `GalleryImage` entry at the bottom of `lib/data.ts`:

```ts
{ id: "my-project-hero", src: "/projects/my-project/01_hero.jpg", alt: "My Project" }
```

That's it. No other files need changing — the project page, detail page, and drawings section all derive from `lib/data.ts`.

---

## Architecture Decisions

### `getPath()` — always use for local assets
`lib/utils.ts` exports `getPath(path)`. In production the site is deployed to GitHub Pages under `/MKS-STUDIO-FINAL-LAUNCH`, so all local asset paths need the basePath prefix. Always use `getPath("/projects/...")` for `src` attributes on local images, video `src`, PDF `href`, and iframe `src`. Never hardcode paths directly.

Exception: `next/image`'s `src` prop uses `getPath()` too, but `Image` components with `fill` or fixed dimensions handle the basePath themselves when `unoptimized: true` is set — still use `getPath()` to be safe.

### LiquidImage — two-effect WebGL architecture
`components/LiquidImage.tsx` renders a Three.js WebGL canvas with a mouse-trail distortion shader.

- **Effect A** (`[]` deps) — runs once on mount. Creates `WebGLRenderer`, `Scene`, `OrthographicCamera`, event listeners (mousemove, touch, resize), and the `tick()` render loop. Stored in refs so they survive re-renders.
- **Effect B** (`[src, fit]` deps) — runs on every src/fit change. Swaps only the texture and `ShaderMaterial`. The renderer is never recreated.
- **`textureCache`** — a module-level `Record<string, THREE.Texture>` shared across all instances. Textures load once per URL per page session — subsequent visits to the same image are instant.

When LiquidImage is inside `AnimatePresence` (as on the homepage), the component remounts on each slide change (renderer recreated, ~50ms). This is intentional — it matches the GitHub original and the textureCache keeps it fast.

### `heroFit` field
Controls how the hero image is displayed in the carousel (`"cover"` crops to fill, `"contain"` letterboxes). Architectural drawings or narrow images should use `"contain"`. Defaults to `"cover"` if omitted. On mobile the carousel always uses `"cover"`.

### Image sizing — natural vs fill
- **Gallery images & projects page cards**: use `width={0} height={0} sizes="..." className="w-full h-auto"` — natural aspect ratio, no cropping.
- **`fill` + `object-cover`**: only for fixed-height containers where cropping is intentional (e.g. hero sections, next-project footer).

---

## Animation System

### Ease curve used everywhere
`[0.76, 0, 0.24, 1]` — a snappy cubic-bezier used for all major transitions (page slides, carousel, clip-path reveals). Keep it consistent.

### `animate-shine` (ICONIC PROJECTS text)
Defined in `app/globals.css`. The keyframe sweeps a white highlight across the text.

```css
animation: shine-text 6s ease-out forwards;
```

The duration is currently **6 seconds**. Adjust here if the user wants it faster/slower. The animation is triggered by incrementing `shineTrigger` state — each new value re-mounts the `<h2 key={shineTrigger}>`, replaying the animation. When `shineTrigger === 0` the text is `text-transparent` (invisible until the loader completes).

### Homepage carousel slide direction
`direction` state: `1` = scrolling down/forward (new image slides in from bottom), `-1` = scrolling up/backward (slides in from top). Used as the `custom` prop on `AnimatePresence` variants.

### Page transitions
`TransitionLink` + `TransitionProvider` handle cross-page transitions. Use `<TransitionLink href="...">` instead of plain `<Link>` whenever a smooth page transition is desired.

---

## Bilingual EN/RO System

All UI strings live in `lib/translations.ts`. Access them with the `t()` function from `useTranslation()`:

```tsx
const { t, lang, setLang } = useTranslation();
t("home.iconicProjects")   // returns EN or RO string based on current lang
```

Per-project bilingual content (`titleRo`, `subtitleRo`, `descriptionRo`) lives directly on each project object in `lib/data.ts`. Pattern throughout the codebase:

```tsx
lang === "ro" && project.titleRo ? project.titleRo : project.title
```

Language preference is persisted to `localStorage` key `"mks-lang"`.

---

## Technical Drawings — Filename → Category Mapping

The Blueprints section in project detail auto-categorises drawings by filename prefix:

| Prefix | Category |
|---|---|
| `A0xx` | Site & Situation |
| `A1xx` | Floor Plans |
| `A3xx` | Facades & Sections |
| `A7xx`, `A9xx`, `*FURNITURE*` | Technical Details |
| everything else | General Documents |

Image files (`.jpg`, `.jpeg`, `.png`, `.webp`) render as full image cards. PDF files render as iframe previews. Both open in a new tab on click.

---

## Known Gotchas & Traps

**`prefers-reduced-motion`**
`globals.css` sets all `animation-duration` and `transition-duration` to `0.01ms` when the OS has "Reduce motion" / "Animation effects" turned off. On Windows: Settings → Accessibility → Visual effects → Animation effects. If ALL animations appear instant simultaneously, this is the cause — not a code bug.

**Static export + basePath**
`next.config.ts` has `output: 'export'` and `basePath: '/MKS-STUDIO-FINAL-LAUNCH'` in production. This means:
- All local paths MUST go through `getPath()`
- `next/image` has `unoptimized: true`
- No server-side features (API routes, SSR) are available
- The site exports to `/out` and is deployed to GitHub Pages

**`sessionStorage` loader gate**
The intro `Loader` component sets `sessionStorage.setItem("loaderShown", "1")` on completion. On subsequent navigations within the same tab, the homepage skips the loader. Clear sessionStorage to see the loader again.

**Video in gallery**
Files ending in `.mp4` in the `gallery` array render as `<video autoPlay loop muted playsInline>`. No thumbnail or poster frame is set — they start playing immediately.

**`LiquidImage` inside `AnimatePresence`**
When the component unmounts (due to `key` change), `Effect A` cleanup runs: cancels rAF, removes all event listeners, disposes the renderer and GPU context. On remount, `Effect A` creates a fresh renderer. With `textureCache`, the texture is reused — only the renderer creation adds latency (~50ms).

**Fonts**
Three Google fonts are loaded: `Inter` (`--font-sans`, body text), `Space_Grotesk` (`--font-display`), `Playfair_Display` (`--font-serif`). Applied via CSS variables in `@theme {}` in globals.css.

**ESLint / TypeScript build errors**
Both are set to `ignoreDuringBuilds: true` in `next.config.ts`. Don't rely on the build to catch type errors — use the editor.
