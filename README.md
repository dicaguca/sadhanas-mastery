# Sadhanas Mastery

Standalone follow-on app for the Fearless Mastery Productivity program.

This workspace is a staging area inside the current repo so we can:

- define the product and data model
- prototype the UI and interaction patterns
- design import logic from the FMP app
- build the first working version before moving it to its own home/domain

## Proposed Direction

- Product name: `Sadhanas Mastery`
- Role: ongoing practice and adaptation workspace
- Relationship to FMP: separate app, with one-time import from the original program

## Current Structure

- `docs/`
  - product blueprint, data model, screen map, and import plan
- `src/`
  - app shell, screens, components, store, and shared logic

## Suggested Build Direction

- React
- Vite
- React Router
- Tailwind
- Local-first persistence
- Explicit import/export support

## Near-Term Plan

1. Finalize v1 blueprint
2. Finalize data model
3. Build dashboard shell
4. Build section screens
5. Build FMP import flow

## Local Preview

From `codex/sadhanas-mastery`:

1. `npm install`
2. `npm run dev`

Then open the local Vite URL shown in the terminal.

## GitHub Pages

This repo is configured to deploy to GitHub Pages as a repository site.

- Vite base path: `/sadhanas-mastery/`
- Router basename: `import.meta.env.BASE_URL`
- Deployment target: built `dist/` output via GitHub Actions

After pushing to `main`, make sure GitHub Pages is set to use `GitHub Actions`.
