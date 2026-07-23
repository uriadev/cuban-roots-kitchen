# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Marketing/menu website for "Cuban Roots Kitchen," a Cuban restaurant. Built with Astro (v7, output via `@astrojs/vercel` adapter) and Tailwind CSS v4. Content is bilingual-leaning (UI copy mixes English and Spanish, e.g. "Pide por Delivery", "Ver Opciones") — match the existing tone when editing copy.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`) — use `pnpm`, not `npm`/`yarn`.

- `pnpm install` — install dependencies
- `pnpm dev` — start dev server at `localhost:4321`
- `pnpm build` — production build to `./dist/`
- `pnpm preview` — preview the production build locally
- `pnpm astro check` — type-check `.astro` files against `tsconfig.json` (strict mode)

There is no test suite and no lint script configured in this repo.

## Architecture

### Menu data is content-collection driven, not hardcoded

The menu is powered by an Astro content collection defined in [src/content.config.ts](src/content.config.ts):

- Loader glob-reads every `*.json` file in `src/data/` (`sandwichs.json`, `main-courses.json`, `drinks.json`, `desserts.json`, `sides.json`). Each JSON file's filename (minus extension) becomes the collection entry's `id`/category slug.
- Each file is an array of items validated by a Zod schema: `{ name, thumbnail: image(), description }`. `thumbnail` must resolve to an image file under `src/assets/` (validated/optimized via Astro's `image()` helper).
- To add a menu category: drop a new `src/data/<category>.json` file (array of `{name, thumbnail, description}`) with matching images in `src/assets/`. No route or config changes needed — [src/pages/menu/[category].astro](src/pages/menu/[category].astro) generates static paths for every entry in the collection automatically via `getStaticPaths` + `getCollection("menu")`.
- **Known naming quirk**: the sandwiches category file/slug is `sandwichs` (no "e"), not `sandwichs`/`sandwiches` consistently — links and `MenuCategory` `isActive` checks use the literal slug `sandwichs`. Keep new category slugs consistent with the filename used across `astro.config.mjs` redirects, `MenuSection.astro` links, and `[category].astro`'s `MenuCategory` blocks.
- `MenuItem.astro` types its `product` prop as `CollectionEntry<"menu">["data"][number]`, so schema changes in `content.config.ts` surface as type errors there rather than as silently blank fields.

### Routing

- `src/pages/index.astro` — homepage, composes `HeroSection`, `MenuSection` (category teaser cards with hardcoded copy/links), `StorySection`, `Feedback`.
- `src/pages/menu/[category].astro` — dynamic, statically-generated per-category menu page (uses `getStaticPaths`, so all category pages are pre-rendered at build time, not SSR).
- `astro.config.mjs` defines a redirect from `/menu` → `/menu/sandwichs`.

### Styling

- Tailwind CSS v4 via the Vite plugin (`@tailwindcss/vite`), configured entirely in CSS: theme tokens (`--color-primary`, `--color-secondary`, `--color-background-light`, `--color-text-light`, `--color-accent-green`) live in the `@theme` block in [src/styles/global.css](src/styles/global.css) — there is no `tailwind.config.js`. Add new design tokens there.
- `@tailwindcss/forms` is a devDependency but currently commented out (`/* @plugin "@tailwindcss/forms"; */` in `global.css`).
- Icons come from `@lucide/astro` (tree-shaken per-icon imports, e.g. `import { Sandwich } from "@lucide/astro"`).
- `clsx` is used for conditional class composition (see `MenuCategory.astro`).

### Images

`sharp` is a direct dependency and is required for Astro's built-in image optimization (`astro:assets`) used throughout menu rendering.

### Deployment

Adapter is `@astrojs/vercel`, so this project builds/deploys for Vercel (server output mode per adapter defaults unless overridden in `astro.config.mjs`).
