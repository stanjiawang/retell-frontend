# Retell Frontend Solution Gallery

A clean Vite + React app using Tailwind CSS where the front page is a gallery of solution entries.
Each solution lives in its own feature folder and is loaded by route.

## Run

```bash
pnpm install
pnpm dev
```

Open: `http://localhost:5180`

## Structure

- `src/App.tsx` - app entry, router only
- `src/app/router.tsx` - route definitions with lazy-loaded pages
- `src/features/home/` - front page / gallery
- `src/features/solutions/` - individual solution implementations
- `src/styles/tailwind.css` - Tailwind CSS entry file
