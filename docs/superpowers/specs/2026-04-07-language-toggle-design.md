# Language Toggle (EN / RO) — Design Spec

**Date:** 2026-04-07  
**Project:** MKS Studio Portfolio (Next.js 15)  
**Scope:** Add a bilingual English / Romanian toggle to all pages

---

## Problem

All user-facing text is hardcoded in English. The client wants Romanian speakers to read the site in their native language, including project titles and descriptions.

## Goal

A single toggle button switches the entire site between English and Romanian instantly. The user's language preference persists across page navigations and browser refreshes.

---

## Approach: Custom Context + Translations File

No new dependencies. React Context + `localStorage` for persistence. All pages are already `"use client"` components so a client-side context is safe.

---

## New Files

### `contexts/LanguageContext.tsx`

- Exports `LanguageProvider` and `useTranslation()` hook
- `useTranslation()` returns `{ t, lang, toggleLang }`
  - `t(key: string): string` — looks up dot-notation key in the active language dict; falls back to the English value if the key is missing in RO, then to the key string itself
  - `lang: "en" | "ro"` — current language
  - `toggleLang(): void` — switches between `"en"` and `"ro"`
- **Hydration safety:** `lang` initialises to `"en"` during SSR/first render; a `useEffect` reads `localStorage` key `"mks-lang"` after mount and updates state. This prevents hydration mismatches.
- Persists to `localStorage` on every toggle.

```tsx
// Provider nesting in layout.tsx (correct order):
<ErrorBoundary>
  <LanguageProvider>          ← outermost, wraps everything
    <TransitionProvider>
      {children}
    </TransitionProvider>
  </LanguageProvider>
</ErrorBoundary>
```

### `lib/translations.ts`

Nested key structure — e.g. `t("nav.home")`, `t("contact.send")`, `t("project.year")`.

Top-level shape:
```ts
export const translations = {
  en: { nav: {...}, home: {...}, about: {...}, contact: {...}, gallery: {...}, projects: {...}, projectDetail: {...}, footer: {...}, common: {...} },
  ro: { ... }
}
```

**Key naming convention:** `section.camelCaseKey`

Covers all ~86 strings across all pages:

| Category | Keys |
|---|---|
| `nav.*` | home, projects, about, contact, gallery, close, allProjects |
| `common.*` | scroll, loading, backToHome, dragToExplore, commercialInteriors, open |
| `home.*` | iconicProjects, viewAllProjects, menuDescription |
| `about.*` | heading1, heading2, philosophyTitle, philosophyBody, studioTitle, studioBody |
| `contact.*` | heading1, heading2, emailLabel, phoneLabel, namePlaceholder, emailPlaceholder, messagePlaceholder, send, thankYou, thankYouSub, sendAnother |
| `gallery.*` | title, loadingGallery, prev, next |
| `projects.*` | loadingProjects |
| `projectDetail.*` | yearLabel, areaLabel, categoryLabel, technicalDocs, blueprintsHeading, blueprintsDesc, siteAndSituation, floorPlans, facadesAndSections, technicalDetails, generalDocs, nextProject, notFound, backToHome |
| `footer.*` | copyright, address, instagram, linkedin, facebook |

---

## Modified Files

### `lib/data.ts`

Each project entry gains three **optional** new fields (optional so the build never breaks if a value is missing):

```ts
titleRo?: string
subtitleRo?: string
descriptionRo?: string
```

All 6 projects will have Romanian values provided as part of this implementation. Pages select the right field:

```ts
const title = lang === "ro" && project.titleRo ? project.titleRo : project.title
```

**Romanian project translations (to be written in implementation):**

| Project | Romanian Title | Romanian Subtitle | Romanian Description |
|---|---|---|---|
| J8 UBISOFT STUDIO | STUDIOUL J8 UBISOFT | Spațiu de Lucru Creativ | O clădire emblematică pentru Ubisoft la J8, concepută pentru creativitate și colaborare. Spațiul integrează estetică industrială modernă cu zone funcționale, arii sociale specializate și birouri panoramice. |
| House Voluntari | CASA VOLUNTARI | Vilă Rezidențială Modernă | O vilă contemporană spectaculoasă în Voluntari, care prioritizează viața indoor-outdoor cu terase generoase, piscină privată și estetică interioară minimalistă. |
| UBISOFT CRAIOVA | STUDIOUL UBISOFT CRAIOVA | Hub Tehnologic Creativ | Un spațiu de lucru dinamic pentru echipa Ubisoft din Craiova, cu zone specializate de coding, huburi creative colaborative și spații sociale pentru noua generație de talente tech. |
| CASA OP | CASA OP | Reședință Privată | O vilă liniștită cu un singur nivel, definită de linii orizontale curate, geamuri generoase și o legătură fluidă interior-exterior. O terasă cu piscină privată și o grădină înconjurătoare încadrează casa în toate anotimpurile. |
| SINGLE FAMILY HOUSE | CASĂ UNIFAMILIALĂ | Reședință Arhitecturală Modernă | O reședință modernă unifamilială cu spații de zi open-plan, integrare perfectă interior-exterior și design contemporan sofisticat. |
| A-FRAME ALEX | A-FRAME ALEX | Reședință A-Frame Modernă | O reședință A-frame deosebită, concepută pentru o conexiune perfectă cu natura. Cu geometrie îndrăzneață și fațade generoase din sticlă, casa oferă atât un refugiu cald de iarnă, cât și o experiență deschisă de vară. |

### `app/layout.tsx`

Wrap children with `<LanguageProvider>` as shown above. No other changes.

### `app/page.tsx`

- Import `useTranslation()`
- Replace all hardcoded strings with `t()` calls
- **Menu animation fix:** The home page splits menu items character-by-character for a stagger animation. Translated strings have different lengths (e.g. "Home" → "Acasă"). The animation loop must use `item.split("")` dynamically — since it already does this, no refactoring needed; just replace the source strings with `t()` values.
- Add EN/RO toggle button to nav area

### `app/about/page.tsx`, `app/contact/page.tsx`, `app/gallery/page.tsx`, `app/projects/page.tsx`

Replace all hardcoded strings with `t()`. Add EN/RO toggle button to each page's nav.

### `app/projects/[id]/ProjectDetailClient.tsx`

Replace all hardcoded strings. Use `lang`-aware field selection for project title/description. Drawing category labels (`t("projectDetail.siteAndSituation")` etc.) are UI text displayed in the drawings section.

### `components/BackHome.tsx`

Read this component and translate its button text using `useTranslation()`.

### `components/Loader.tsx`

Read and translate any visible text.

---

## Toggle Button UI

Added to the top-right of the `<nav>` element on every page, after existing nav links:

```
  Home   Contact   EN · RO
```

- `EN` and `RO` separated by a `·` divider
- Active language: full opacity, slightly bolder
- Inactive language: `opacity-40`
- Font size `text-[10px]`, `tracking-[0.2em]`, `uppercase` — matches existing nav link style
- Clicking either label sets that language (not just a toggle — allows jumping directly to EN or RO)
- On mobile: appears in the same nav row, compact

---

## Out of Scope

- URL-based locale routing (`/ro/about`) — not needed for a toggle
- Auto-detecting browser language — not requested
- `hreflang` SEO meta tags — can be added later
- Translating gallery `alt` text in `lib/data.ts` galleryImages — not user-visible text
- Translating contact info (email, phone, address) — business data, not UI

---

## Verification

1. `npm run dev` — toggle EN↔RO on every page, confirm all text switches
2. Refresh the page — language preference must persist
3. Navigate between all pages — language must not reset
4. `/projects/[id]` detail page — project title, description, drawing labels all translate
5. Contact form — placeholders, success state translate correctly
6. `BackHome` component text translates
7. Home page menu animation works for both languages (different string lengths)
8. `npm run build` — zero TypeScript errors
