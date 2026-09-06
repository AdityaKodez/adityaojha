# agents.md

> Standing context for this repo. Read it before the first edit, and update it in
> the same commit whenever a convention changes.

## 1. House rules

Five rules sit above everything else.

1. **UI copy avoids uppercase.** Avoid `ALL-CAPS` and shouting. Prefer
   lowercase or natural sentence case where it reads better. Never force
   every string to lowercase. Scope and exceptions in [§11 UI copy](#11-ui-copy).
2. **No em dashes.** Never use the em dash character (the long dash) in UI copy or documentation. Rewrite with a comma, colon, or period instead.
3. **One border per edge.** Never put a border on top of a border that already
   exists. See [§10 Borders](#10-borders).
4. **Scoped edits.** Change what was asked for. Unrelated files stay untouched,
   including work already sitting dirty in the tree.
5. **Ask before pushing.** At the end of every run, once the work is complete
   and verified, use the AskUserQuestion tool to ask whether to push the
   changes to GitHub. Only commit and push when the answer is yes. Never push
   without asking first.

Working style: finish the task, then report the result in a few lines. No
preamble, no recaps, no process commentary. When a detail is missing, take the
reasonable default, note the assumption, and keep moving.

## 2. What this is

A single-page portfolio for Aditya Ojha (akoder.xyz) with a component showcase
at `/components` that doubles as a public shadcn registry. No backend, no
database, no auth, no payments. All content is typed configuration.

- Production: https://akoder.xyz
- Repository: github.com/AdityaKodez/adityaojha
- Deploy: Vercel, from the main branch

## 3. Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16, App Router, React Server Components, Turbopack |
| UI | React 19 |
| Language | TypeScript 5, strict |
| Styling | Tailwind 4 via `@tailwindcss/postcss`, plus `@tailwindcss/typography` and `tw-animate-css` |
| Primitives | Radix UI and Base UI, vendored into `components/ui/` |
| Motion | Motion 12 |
| Icons | `lucide-react`, `react-icons`, and local icon components under `public/` |
| Fonts | Geist (sans, mono, pixel grid) and Instrument Serif (`lib/fonts/`) |
| Theming | `next-themes`, class-based dark mode |
| Dates | `date-fns` 4 with `date-fns-tz` |
| Markdown | `react-markdown` on the client surface, `next-mdx-remote` with Shiki on the server surface |
| Tooling | ESLint 9 via `eslint-config-next`, shadcn CLI 4 |
| Analytics | Vercel Analytics and Speed Insights, both wired into the root layout |

## 4. Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run lint` | ESLint across the repo |
| `npm run registry:build` | Runs `scripts/build-registry.mjs`, writes `public/r/*.json` |
| `npm run build` | Runs `prebuild` (registry build) then the production build |
| `npm run start` | Serves the production build |

There is no typecheck script; run `npx tsc --noEmit` directly.

## 5. Directory map

| Path | Contents |
| --- | --- |
| `app/` | Routes: `page.tsx` (home), `bookmarks/` and `certifications/` (collections), `components/` and `components/[id]/` (showcase), `project/[id]/` (case studies), `api/discord-status/route.ts`; plus `layout.tsx`, `error.tsx`, `globals.css`, `robots.ts`, `sitemap.ts`, `manifest.ts`, `opengraph-image.tsx`, `not-found.tsx` |
| `components/` | Subdivided into `landing/` (one file per home section, hero, about, skills, etc.), `showcase/` (catalog, shell, preview), `content/` (markdown overrides, prose blocks), `shared/` (header, footer, theme provider, logo), `ui/`, `motion-primitives/`, `skeletons/` |
| `components/ui/` | Vendored shadcn and Radix primitives; source of most registry items |
| `components/motion-primitives/` | Motion-heavy building blocks |
| `components/skeletons/` | Loading placeholders |
| `config/` | The data layer, one file per domain, plus `types.ts` |
| `content/` | Markdown docs for the showcase |
| `lib/` | `utils.ts` (the `cn` helper), `github.ts`, `discord-status.ts`, `highlight.ts`, `react-query.ts`, `fonts/` |
| `public/` | Static assets; `public/r/` holds generated registry JSON |
| `scripts/` | `build-registry.mjs` |
| `plans/` | Private planning docs, gitignored |

## 6. Data layer: the database

There is no runtime database and no server-side persistence. The "database" is
the typed config layer in `config/`: plain TypeScript objects, checked by the
compiler, imported directly by the components that need them. `config/` is the
single source of truth for content, change content there, never inline in a
component.

| File | Holds |
| --- | --- |
| `config/types.ts` | Every shared type, plus the `SectionId` union |
| `config/site.ts` | The root `siteConfig` object, meta, personal info, section order, section flags, banner, about, services, workflow, contact |
| `config/hero.ts` | `heroConfig`, hero copy |
| `config/skills.ts` | `skillsSectionConfig` + `skillsConfig` |
| `config/socials.ts` | `socialSectionConfig` + `socialsConfig` |
| `config/projects.ts` | `projectsSectionConfig` + `projectsConfig` |
| `config/experience.ts` | `experienceSectionConfig` + `experienceConfig` |
| `config/testimonials.ts` | `testimonialsConfig` |
| `config/components.ts` | `componentsSectionConfig` (home teaser), `componentRegistry` plus `findComponent()` and `getEnabledComponents()` |
| `config/registry.ts` | Registry helpers, `getAddCommands()` (direct URL `https://akoder.xyz/r/<id>.json` per package manager), `getRegistrySetupSnippet()` |
| `config/world-cities.ts` | City coordinates used by the dotted world map |

Pattern to copy: every domain exports a section config object (heading text) and
a typed item array. Every item carries `id`, `order`, and an optional `enabled`
flag.

## 7. Schema

All types live in `config/types.ts`.

- **`SiteMetaConfig`**, `url`, `title`, `titleTemplate`, `shortTitle`,
  `description`, `keywords`, `authors`, `creator`, `publisher`,
  `classification`, `category`, `locale`, `ogImage`, `twitterCreator`, `icon`,
  `appleIcon`, `googleVerification`, `manifest`, `robots`, `sitemap`.
- **`PersonalInfo`**, `fullName`, `firstName`, `avatar` (`src`, `alt`,
  `fallback`), `location` (`label`, `timezone`), `githubUsername`.
- **`HeroConfig`**, `greeting`, `waveEmoji`, `headlineBefore`,
  `highlightedPhrases`, `headlineAfter`, `description`, `descriptionHighlight`.
- **`AboutConfig`**, `title`, `body`, `emphasizedPhrases`.
- **`SkillItem`**, `id`, `name`, `icon`, `category` (`language`, `frontend`,
  `backend`, `workflow-ai`), `order`, `enabled`.
- **`SocialLink`**, `id`, `platform`, `handle`, `href`, `icon`, `order`,
  `enabled`, `action` (`copy`, `external`, `mailto`), `copyValue`,
  `shortcutKey`, `tooltipDefault`.
- **`Testimonial`**, `id`, `name`, `role`, `content`, `avatar`, `image`,
  `order`, `enabled`.
- **`Project`**, `id`, `title`, `description`, `content`, `image`, `imageAlt`,
  `liveUrl`, `githubUrl`, `year`, `status` (`building`, `new`, `shipped`),
  `category`, `tags`, `metrics` (icon `users` or `chart`, plus `label`),
  `order`, `enabled`.
- **`ExperienceItem`**, `id`, `role`, `company`, `period`, `summary`,
  `highlights`, `order`, `enabled`.
- **`Bookmark` / `Certification`**, `id`, `url`, `title`, `domain`, `date`
  (certifications only), `icon` component.
- **`ComponentDoc`**, `id`, `title`, `description`, `icon`, `demoPath`,
  `docPath`, `order`, `enabled`.
- **`ContactConfig`**, `title`, `description`, `pricing` (label, value, note),
  `channels` (reuses `SocialLink`).
- **`PortfolioConfig`**, `meta`, `personal`, `sectionOrder`, `sectionFlags`,
  `bookmarks`, `certifications`, `banner`, `about`, `services`, `workflow`,
  `contact`.

## 8. Sections and flags

The home page is a loop, not a hand-written layout.

- `app/page.tsx` maps over `siteConfig.sectionOrder` and skips any id whose
  `sectionFlags` entry is false, so reordering or hiding a section is a config
  change only.
- Every non-GitHub section has an entry in the `staticSections` map in
  `app/page.tsx`, keyed by `SectionId` .
- `github` is special: it is server-fetched, wrapped in React Suspense with
  `components/skeletons/github-skeleton.tsx`, and only rendered when
  `GITHUB_TOKEN` is present.
- The current order is projects, components, skills, about, github,
  testimonials, bookmarks, socials. Certifications, experience, services,
  workflow and contact exist but are flagged off.
- `components` is a teaser, not the showcase: it previews
  `componentsSectionConfig.previewCount` registry entries and ends in a
  `see all n components` link to `/components`. Keep it that way, the full
  catalog lives on the route, not on the home page.

To add a section:

1. Add the id to the `SectionId` union in `config/types.ts`.
2. Build the component in `components/`.
3. Register it in `staticSections` in `app/page.tsx`.
4. Add its flag and its position to `siteConfig`.

Collapsible sections use `AccordionSection` in
`components/ui/accordion-section.tsx`, it owns the heading, the expand
animation, and the dashed top rule. Do not hand-roll a second variant.

## 9. Design system

- Colors come from semantic tokens only, `background`, `foreground`, `card`,
  `popover`, `muted`, `muted-foreground`, `primary`, `secondary`, `accent`,
  `destructive`, `border`, `input`, `ring`, and `chart-1` through `chart-5`.
  They are declared as raw custom properties on `:root` and `.dark`, then
  re-exported through the `@theme inline` block in `app/globals.css`. Never
  hardcode a hex value in a component.
- Radii derive from a single `--radius` (0.45rem) as `sm`, `md`, `lg` and up.
  Use the tokens rather than literal values.
- Dark mode is class-based: `@custom-variant dark (&:is(.dark *))` plus
  `next-themes`, so `dark:` utilities follow the `.dark` class on `<html>`.
- Motion tokens live in `app/globals.css` (`--motion-duration-base`,
  `--motion-ease-standard`). Entrances are short, 0.3s with the ease
  `[0.22, 1, 0.36, 1]`, and `whileInView` fires once rather than on every
  scroll pass.
- Shared utility classes: `.section-heading`, `.micro-transition`, and the
  blueprint background used on card hover. Prefer these over repeating the
  utility stack.

## 10. Borders

This site is drawn with hairlines, and hairlines compound fast. The rule is
simple: **one border per edge, one mechanism per element.**

- The shell owns the outer frame. `<main>` in `app/page.tsx` carries
  `max-w-3xl mx-auto border-x border-b-2 overflow-x-clip`. Nothing inside it
  re-declares an outer frame or adds a vertical side rule.
- Each section owns exactly one dashed top rule (`border-t border-dashed`). If a
  parent already draws a rule on that edge, the child does not add another.
- `.section-heading` in `app/globals.css` already declares
  `border-y border-dashed`. An element using that class must not also carry
  `border-t` or `border-b`.
- Pick either `ring-1 ring-inset` or `border`, never both on the same element.
  In this codebase cards and pills use `ring-1 ring-inset`; separators use
  `border`.
- Inside `.prose`, blocks already get a radius. Do not wrap them in a second
  bordered and ringed container.
- When a new wrapper is needed, move the border to the outermost element of the
  group instead of adding one per child.
- Divider elements use the `Separator` primitive, which draws its own line. Do
  not add a `border-t` alongside it.

## 11. UI copy

**UI copy avoids uppercase.** Avoid `ALL-CAPS` and shouting. Prefer
lowercase or natural sentence case where it reads better, never force
every string to lowercase.

```tsx
// both are fine, just don't shout
const TAB_LABELS: Record<Tab, string> = {
  preview: "preview",
  code: "code",
};
// sentence case is also fine when it reads better
const EMPTY_STATE = "No activity right now.";
```

Guideline:

- tab labels, segmented controls, and collection switchers
- buttons and their state text (`copy` → `copied!` → `copy failed`)
- tooltips, `aria-label`, `alt`, and `title` attributes
- status pills and empty states
- legends (heatmap `less` / `more`)
- page and section headings rendered from code
- control labels and tooltips that live in `config/` (for example
  `themeTooltip: "toggle theme"`)

Prefer lowercase for these where it fits the design, but sentence case is
allowed when it improves readability. What to avoid is `ALL-CAPS`, `TITLE CASE`
shouting, and inconsistent casing within the same surface.

Deliberately **excluded**, leave these as authored:

- **Proper nouns and brand names.** "GitHub", "Discord", "TypeScript",
  "Next.js", "React", "Visual Studio Code", city names, people's names.
- **Editorial content in `config/`.** The about body, services, workflow
  descriptions, testimonials, bookmark titles, project copy.
- **SEO and metadata.** `meta.title`, `titleTemplate`, OG image alt text,
  `generateMetadata` output, and the JSON-LD block in `app/layout.tsx`.
- **Keyboard key identifiers.** `"ArrowRight"`, `"Home"`, `"End"`, these are
  DOM `KeyboardEvent.key` values and must match exactly.
- **Console and thrown errors.** Internal diagnostics, not user-facing copy.
- **Demo fixture data** under `app/components/[id]/demos/`, sample content that
  exists to show a component working.

## 12. Typography

- Body copy is DM Sans at 14px (`text-sm`). `text-xs` is for meta, and
  `text-base` is the largest size in normal use.
- Headings are `font-medium` with `tracking-tight`. `font-semibold` appears on a
  few section headings only; nothing is heavier than 600 anywhere.
- Mono is Geist Mono, 10–12.5px, for meta labels, keyboard hints, and code.
- Pixel accents use `font-pixel` (Geist Pixel Grid); serif accents use
  `font-serif` (Instrument Serif). Both appear sparingly.
- Section headings use the `.section-heading` class rather than ad-hoc sizes.

## 13. Markdown rendering

Two surfaces render Markdown and they must stay in sync.

| Surface | Renderer | File |
| --- | --- | --- |
| Component docs at `/components/[id]` | `MarkdownAsync` from `next-mdx-remote`, server-rendered | `app/components/[id]/page.tsx` |
| Project case studies | `react-markdown`, client-rendered | `app/project/[id]/project-content.tsx` |

- Both pass the shared override map from `components/content/markdown-components.tsx`.
  Never inline a second set of overrides.
- All `.prose` styling lives in one **unlayered** block of `app/globals.css`. It
  has to stay unlayered: the typography plugin registers its rules through
  `addComponents`, so `.prose` ends up layered and loses to unlayered CSS
  regardless of specificity.
- Prose colors are mapped onto project tokens (`--foreground`,
  `--muted-foreground`, `--primary`, `--border`). That makes `prose-neutral`
  and `dark:prose-invert` in markup effectively inert, do not rely on them.

## 14. Registry pipeline

The site publishes its own shadcn registry. It is JSON served over HTTP;
nothing is registered with shadcn itself.

1. `registry.json` at the root is the catalog, name `akoder`, homepage
   akoder.xyz, and an `items` array. Each item declares `name`, `type`,
   `title`, `description`, `dependencies` (npm packages),
   `registryDependencies` (shadcn items such as `tooltip`), `files`, and a
   `docs` string.
2. `scripts/build-registry.mjs` reads the catalog, inlines each file's source,
   and writes `public/r/registry.json` plus one `public/r/<name>.json` per
   item. It runs on `prebuild`, so Vercel always ships fresh JSON.
3. Consumers install directly with `npx shadcn add https://akoder.xyz/r/<name>.json`,
   or register the `@akoder` namespace in their `components.json` and install with
   `npx shadcn add @akoder/<name>`.

Rules:

- Any edit to a file listed in `registry.json` must be followed by
  `npm run registry:build`, or the published JSON goes stale.
- Published files must be self-contained. A consumer's project has no `config/`
  directory, no `@/config/*` imports, and no site-specific data. Inline data or
  accept it as props.
- Self-containment wins over the §9 token rule: published files may inline
  literal colors (hex/oklch) or use `var(--token, literal-fallback)` so they
  still render in projects that lack this site's tokens. Site-internal
  components still follow §9.
- Keep UI copy inside published components lowercase too where it fits, it is part of the
  design language consumers are installing. Avoid uppercase shouting there as well.
- Current items: dotted-world-map, copy-command-block, github-map,
  project-explorer, progressive-blur, infinite-slider, carousel, mode-toggler,
  interactive-skill-cloud, contact-channels, section-rail, progress-bars,
  command-palette.

## 15. Component showcase

- `config/components.ts` holds `componentRegistry` plus two helpers:
  `findComponent(id)` skips disabled entries, and `getEnabledComponents()`
  returns enabled entries sorted by `order`.
- Each entry points at a live demo under `app/components/[id]/demos/` and a
  Markdown doc under `content/components/`.
- `getComponentIcon(name)` in `components/showcase/component-icons.tsx` maps an
  `icon` key onto its icon component. Both the showcase and the home teaser use
  it, do not write a second switch.
- Set `enabled: false` to hide an entry without deleting it.
- To add a component: write the doc file, write the demo file, add the catalog
  entry, and, if it should be installable, add the file to `registry.json`.

## 16. Environment

| Variable | Used by | Behaviour when missing |
| --- | --- | --- |
| `GITHUB_TOKEN` | `lib/github.ts`, `app/page.tsx` | The GitHub section is skipped entirely, by design, not a bug |
| `DISCORD_USER_ID` | `app/api/discord-status/route.ts` | Falls back to a hardcoded user id |

Gotchas:

- A dev server is normally already running on http://localhost:3000. Starting a
  second one fails with "Another next dev server is already running", reuse
  the existing one rather than switching ports.
- `next build` cannot run in the sandbox: Turbopack's cleanup of
  `.next/turbopack` trips the bulk-delete guard. Validate with
  `npx tsc --noEmit` and the dev server instead.
- `var(--font-mono)` does not work in hand-written CSS. `@theme inline` makes
  Tailwind inline the value instead of emitting the variable, so use the
  `font-mono` utility or `var(--font-geist-mono)`.
- `plans/` is gitignored and is not part of the shipped site.

## 17. Definition of done

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run registry:build` if any file referenced by `registry.json` changed
4. Check the result in the dev server on http://localhost:3000
5. Update this file if a convention changed
