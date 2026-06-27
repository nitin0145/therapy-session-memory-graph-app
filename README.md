# Therapy Session Memory Graph

## Project Overview
This project is an interview-friendly take-home assessment built for therapists to manage patients, record session transcripts, extract semantic memory entities using OpenAI, and visualize long-term patient paths using an interactive memory graph and timeline.

## Features
- **Patient Management:** Create and view patients in a simple dashboard.
- **Therapy Sessions:** Record raw session transcripts sequentially.
- **AI Transcript Analysis:** Single-click OpenAI integration to extract structured topics, coping strategies, emotions, people, diagnoses, and risk flags.
- **Chronological Timeline:** Visually track all past sessions chronologically.
- **Memory Graph:** Visualize relationships between the patient, their sessions, and the extracted memory entities using a React Flow architecture.
- **Contradiction Detection:** Rule-based heuristics flag sudden risk escalations, medication abandonment, or substance abuse relapses natively on the server.

## Tech Stack
- **Framework:** Next.js 15 (App Router, Server & Client Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma (v7, using pure pg adapter)
- **AI Integration:** OpenAI SDK (gpt-4o, structured JSON format)
- **Visualization:** React Flow (@xyflow/react)
- **Validation:** Zod

## Architecture
The application uses a **Monorepo Architecture** where the frontend and API securely coexist. 
It relies heavily on **Server Components** for fetching and validating data directly against the database via Prisma, reducing client-side bloat. Client Components are used strictly for interactivity (Dialogs, Toasts, React Flow). The backend logic resides entirely within Next.js Route Handlers (`/api/*`).

## Folder Structure
```text
/
├── prisma/
│   └── schema.prisma              # Patient, TherapySession, MemoryEntity
├── src/
│   ├── app/
│   │   ├── api/                   # Route Handlers (analyze, patients, sessions)
│   │   ├── patients/              # Patient specific routes
│   │   ├── sessions/              # Session specific routes
│   │   ├── layout.tsx             # Root layout with sidebar & toaster
│   │   └── page.tsx               # Dashboard view
│   ├── components/
│   │   ├── layout/                # Sidebar, Navbar
│   │   ├── patients/              # Patient UI (Memory Graph, Modals)
│   │   ├── sessions/              # Session UI (Analyze Button, Modals)
│   │   └── ui/                    # shadcn reusable components
│   └── lib/
│       └── prisma.ts              # Global Prisma adapter configuration
└── .env.example                   # Env template
```

## Database Schema
- **Patient:** Represents the core individual (`fullName`, `age`, `gender`).
- **TherapySession:** Represents a single visit belonging to a Patient (`title`, `transcript`, `summary`, `sessionDate`).
- **MemoryEntity:** Represents a single extracted concept belonging to a Session (`type`, `value`).

## Installation
1. Clone the repository.
2. Run `npm install` to install all dependencies.

## Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Fill in your `DATABASE_URL` (Neon Postgres) and `OPENAI_API_KEY`.

## Running Locally
1. Start the Next.js development server:
```bash
npm run dev
```
2. Navigate to `http://localhost:3000`.

## Prisma Commands
To synchronize your database with the schema, run:
```bash
npx prisma db push
```
*(No explicit migrations required for rapid local prototyping).*

To update the local Prisma client types:
```bash
npx prisma generate
```

## OpenAI Setup
Ensure you have an active OpenAI developer account and your key has active billing. The application utilizes the `gpt-4o` model combined with `response_format: { type: 'json_object' }`.

## Deployment
This project is optimized for deployment on Vercel. 
1. Link your GitHub repository to Vercel.
2. In the Vercel dashboard, configure the `DATABASE_URL` and `OPENAI_API_KEY` environment variables.
3. The default Vercel build command (`next build`) and install command (`npm install`) work automatically.
4. Add a `postinstall` script in your `package.json` to generate the Prisma client before building: `"postinstall": "prisma generate"`.

## Future Improvements
- **Authentication:** Add NextAuth or Clerk for secure therapist logins.
- **Streaming UI:** Utilize the AI SDK to stream the OpenAI extraction live into the UI.
- **Graph Editing:** Allow dragging and saving layout state for the Memory Graph.
- **Full Text Search:** Implement searching across past transcripts and memory entities.

## Screenshots Placeholder
*(Add images of the Dashboard, Graph, and Analysis screens here)*

## License
MIT
