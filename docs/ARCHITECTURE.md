# Architecture

The walking skeleton deliberately keeps the editor independent from Supabase:

```text
React and React Konva
          |
          v
Zustand editor state
          |
          v
LayoutRepository interface
          |
          v
SupabaseLayoutRepository
          |
          v
Supabase Data API / PostgreSQL JSONB
```

React components read and mutate the Zustand store while editing. Konva drag events only update that in-memory domain state. A remote write happens only when the user chooses **Save Layout**.

`LayoutRepository` defines the persistence boundary. UI and editor state never call `supabase.from(...)`. `SupabaseLayoutRepository` is the only implementation that knows the Supabase API and maps database rows into domain `Layout` objects. A future repository can implement the same interface without rewriting the canvas/editor.

`LayoutDefinition` is an explicit serializable domain format. It is stored directly in `layouts.definition` as JSONB, exported to a JSON file, and validated before import. It is not a serialized Konva stage.

## Authentication

`AuthProvider` subscribes to Supabase Auth session changes. Router guards redirect unauthenticated users away from `/app`; Supabase RLS independently limits every `layouts` query to the authenticated row owner. The browser receives only the publishable key.

## Deployment

Vite produces static files in `dist`. `vercel.json` rewrites every requested route to `index.html`, allowing React Router to resolve SPA routes such as `/app` after a direct visit or browser refresh.
