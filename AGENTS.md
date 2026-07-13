# Extract Components Types Skill

Use this skill whenever generating, refactoring, or modifying React/Next.js components, hooks, or API files that require TypeScript interfaces, types, or enums.

## Intent Trigger

- "Create a new component"
- "Add a new feature"
- "Refactor types"
- "Define props for this component"

## CRITICAL CONSTRAINTS (CRUCIAL)
- **ABSOLUTELY NO COMMENTS:** Never write any comments, inline comments, TODOs, or documentation blocks inside any code files (TSX, TS, CSS, Config). 
- **NO EXPLANATIONS IN CODE:** If you need to explain how the code works, write it strictly in the chat output—never as code comments. The code must remain 100% clean and comment-free.

## Architecture Rules

1. **No Inline Types:** Never declare complex prop interfaces, API response types, or shared object types directly within a component file (e.g., inside `src/app/page.tsx` or individual components).
2. **Directory Placement:** All types must be written into a dedicated file or feature folder inside the `src/types/` directory.
   - For shared models, use global type definitions (e.g., `src/types/workout.ts`).
   - For a specific feature or a complex component, create a matching types file (e.g., `src/types/components.ts`).
3. **Clean Imports:** Always export the types using explicit named exports and import them into your components using the `import type` syntax to keep bundle sizes lean.
4. **No Code Comments (Strict):** Do not write any explanatory comments, inline comments, or TODOs inside the generated TypeScript, TSX, or configuration code. The code must be completely clean, self-documenting, and free of comment blocks.

## Example Workflow

### 1. File: `src/types/components.ts`
```typescript
export interface CardProps {
  title: string;
  count: number;
}