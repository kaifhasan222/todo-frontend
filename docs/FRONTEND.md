# Frontend Guide

## Architecture

The frontend lives in `apps/frontend` as a standalone Next.js App Router project. The first route renders the usable todo experience directly, with no landing-page detour.

Feature code is grouped by domain:

- `src/features/todos/api`: HTTP client functions for the Express API.
- `src/features/todos/components`: Todo-specific UI components.
- `src/features/todos/hooks`: React Query and validation hooks.
- `src/features/todos/styles`: CSS Modules owned by todo components.
- `src/features/todos/types`: Todo feature TypeScript types.
- `src/features/todos/utils`: Todo-specific pure helpers.

Shared code is grouped under `src/shared`:

- `components`: reusable UI such as `Modal`.
- `store`: global UI state stores.
- `styles`: common CSS tokens and base styles.
- `types`: common API and app types.
- `utils`: common helpers.

Global CSS entrypoints live in `src/styles`.

## API

Set `NEXT_PUBLIC_API_BASE_URL` when the backend is not running at `http://localhost:5000`.

Expected backend endpoints:

- `GET /apis/todos`
- `GET /apis/todos/:id`
- `POST /apis/todos`
- `PUT /apis/todos/:id`
- `DELETE /apis/todos/:id`

The todo model is:

```ts
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
```

## State And Data

Server data belongs in React Query. Use query invalidation after create, update, toggle, and delete mutations.

Global client UI state belongs in the Zustand store. Current examples are filter, search text, selected todo, and modal state.

Form validation belongs in custom hooks. Do not place validation rules inline inside submit handlers unless the rule is component-only and trivial.

## Styling Rules

Use CSS Modules for component styles and shared CSS token files for common values. Use `rem` units for spacing, dimensions, borders, shadows, and media queries. Do not use `px`.

Keep todo feature styles in `src/features/todos/styles`. Keep reusable/global styles in `src/shared/styles` or `src/styles`.

## Local Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```
