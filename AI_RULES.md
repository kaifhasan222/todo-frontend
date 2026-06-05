# AI Frontend Rules

Follow these rules when changing `apps/frontend`.

## Structure

- Keep feature code inside `src/features/<feature-name>`.
- Keep reusable code inside `src/shared`.
- Keep global CSS imports inside `src/styles/globals.css`.
- Add new todo UI styles under `src/features/todos/styles`.
- Add shared style primitives under `src/shared/styles`.

## Data And State

- Use React Query for backend data.
- Use Zustand only for client UI state.
- Do not duplicate server data in the global store.
- Keep API calls inside feature `api` folders.

## Validation

- Use custom hooks for form validation.
- Keep validation messages human-readable and close to the relevant feature.
- Trim todo titles before sending them to the API.

## Styling

- Use CSS Modules for component-level styles.
- Use `rem` units only. Do not add `px`.
- Prefer CSS tokens from `src/shared/styles/tokens.css`.
- Keep components responsive before adding visual polish.

## UI

- Use reusable modal components for modal flows.
- Use toast feedback for mutation success and failure.
- Include loading, error, empty, and disabled states for async UI.
- Keep the first route as the actual app experience.
