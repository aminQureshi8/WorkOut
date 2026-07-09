# Next.js TypeScript Quality Guard

Use this skill whenever you write, refactor, or modify any React components, pages, or API routes to ensure they comply with our TypeScript strict mode.

## Intent Trigger

- "Create a component"
- "Fix this type error"
- "Refactor the page"

## Directives

1. Always use explicit type annotations or interface definitions for component Props.
2. For Next.js App Router features (like `params` or `searchParams`), ensure correct async/sync typing according to Next.js standards.
3. If using React hooks (`useState`, `useEffect`), ensure the file has the `'use client';` directive at the absolute top.

## Validation Execution

Run the local compilation check to verify your changes did not break the build:

```bash
pnpm tsc --noEmit
```