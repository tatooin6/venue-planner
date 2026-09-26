# Layout Spike

Technical spike and deployment-first walking skeleton for a future application that manages table layouts and reservations. This repository intentionally validates only the technical architecture: authentication, a JSONB-backed layout editor, client-side JSON import/export, PDF/QR generation, and Vercel SPA deployment. It is not the reservation product.

## Stack

- React, TypeScript (strict), Vite, React Router, Tailwind CSS
- Zustand for editable canvas state
- React Konva for the interactive canvas
- Supabase Auth and Postgres Data API, behind `LayoutRepository`
- jsPDF and qrcode, entirely client-side

## Requirements

- Node.js 20 or newer
- A Supabase project
- A Vercel account for production validation

## Local setup

1. Install packages with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. In Supabase Dashboard, open **Connect** and copy the project URL and publishable key into `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. Run the SQL in `supabase/migrations/001_create_layouts.sql` using the Supabase SQL Editor, or apply it through the Supabase CLI.
5. In Supabase Dashboard, create an administrator under **Authentication > Users > Add user** using email and password. Public sign-up is not implemented by this application.
6. Start the application with `npm run dev`.

The frontend only uses the Supabase publishable key. Never add the service-role key to a Vite environment variable.

## Commands

- `npm run dev` starts Vite locally.
- `npm run lint` checks source files.
- `npm run test` runs the small Vitest domain-validation suite.
- `npm run build` produces the production build.

## Vercel deployment

1. Push this single repository to your Git provider and import it in Vercel.
2. Use Vercel's detected Vite settings: build command `npm run build`, output directory `dist`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in **Project Settings > Environment Variables** for Production (and Preview if desired).
4. Deploy.
5. In Supabase Dashboard under **Authentication > URL Configuration**, add the Vercel production URL to allowed redirect URLs if your Supabase project configuration requires it.

`vercel.json` rewrites all paths to `index.html`, so React Router can load and refresh `/app` without a Vercel 404.

## Manual production checklist

1. Open `/app` directly while signed out and confirm redirect to `/login`.
2. Sign in with the administrator account.
3. Add one table and four chairs, drag them to distinct positions, and select/delete one object if desired.
4. Save the layout, refresh the page, choose it in **Saved layouts**, and confirm the positions match.
5. Export JSON, create a new layout, import the exported file, and verify the canvas is restored.
6. Save the imported layout and confirm it appears remotely after refresh.
7. Generate the ticket PDF and confirm it includes Architecture Spike, Test Guest, Table 4, and a QR image.
8. Visit and refresh `https://<your-domain>/app` directly without a 404.

## Scope limits

No venue, event, reservation, guest, capacity, check-in, payment, ticket validation, public pages, or layout versioning features are included. Layout import validates the supported version-1 shape but does not sanitize semantic placement or enforce business rules.
