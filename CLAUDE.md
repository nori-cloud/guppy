# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Guppy is a Next.js 15 application for creating and managing link-in-bio style profiles. Users can create profiles with custom links, integrate third-party services (like Steam), and share their profiles publicly.

## Development Commands

### Running the Application
```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Database Management
```bash
pnpm db:generate-migration  # Generate Drizzle migrations from schema changes
pnpm db:push                # Push schema changes directly to database (dev only)
pnpm db:visualizer          # Launch Drizzle Lab to visualize schema
```

## Environment Setup

Required environment variables are defined in `src/system/env.ts` and `src/module/analytics/env.ts`. See `.env.example` for a complete reference.

**Critical variables:**
- `DATABASE_URL`: PostgreSQL connection string (required to boot)
- `BETTER_AUTH_SECRET`: Auth token signing secret (generate at https://generate-secret.vercel.app/32)
- `BETTER_AUTH_URL`: Base URL for auth callbacks (e.g., http://localhost:3000)

**Optional OIDC authentication** (all or none):
- `AUTH_OIDC_ID`, `AUTH_OIDC_CLIENT_ID`, `AUTH_OIDC_CLIENT_SECRET`, `AUTH_OIDC_DISCOVERY_URL`

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router) with React Server Components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with generic OAuth/OIDC support
- **Styling**: Tailwind CSS with Radix UI components
- **Type Safety**: TypeScript with Zod validation

### Directory Structure

```
src/
├── app/              # Next.js app router pages
│   ├── (public)/     # Public routes (profiles)
│   ├── (protected)/  # Auth-protected routes (dashboard, editor)
│   └── auth/         # Authentication pages
├── components/ui/    # Reusable Radix UI components
├── db/               # Database layer
│   ├── schema.ts     # Drizzle schema definitions
│   ├── profile.ts    # Profile database operations
│   ├── link.ts       # Link database operations
│   ├── user.ts       # User database operations
│   └── model.ts      # TypeScript types/models
├── lib/              # Core libraries
│   ├── auth.ts       # Better Auth server configuration
│   ├── auth-client.ts # Better Auth client setup
│   └── auth-action.ts # Server actions for auth
├── module/           # Feature modules
│   ├── analytics/    # Umami analytics integration
│   ├── auth/         # Auth UI components
│   ├── dashboard/    # Dashboard functionality
│   ├── editor/       # Profile editor with link management
│   └── profile/      # Public profile display
└── system/           # System utilities
    ├── env.ts        # Environment variable configuration
    ├── route.tsx     # Type-safe routing helpers
    ├── theme.tsx     # Theme provider
    ├── flags.ts      # Feature flags
    └── formatter.ts  # Utility formatters
```

### Key Architectural Patterns

#### Database Access Layer
Database operations are centralized in `src/db/` with dedicated files per entity:
- `schema.ts`: Single source of truth for all Drizzle table definitions
- `{entity}.ts`: Database operations exported as an object (e.g., `profileDB`, `linkDB`)
- Server actions in `src/module/*/action.ts` call these database operations

Example pattern:
```typescript
// src/db/profile.ts
export const profileDB = {
  create,
  getById,
  getByName,
  update,
  remove,
}

// src/module/editor/action.ts
"use server"
export async function updateProfile(profile: UpdateProfileInput) {
  await profileDB.update(profile)
  revalidatePath(SettingsPage.Url())
}
```

#### Type-Safe Routing
Routes are defined as objects in `src/system/route.tsx` with:
- `Metadata`: Next.js metadata
- `Url(params)`: Function to generate URLs with type-checked params
- `Link(props)`: Pre-configured Next.js Link component

Example:
```typescript
EditorPage.Url({ name: "johndoe" })  // Returns: "/johndoe/editor"
<EditorPage.Link name="johndoe">Edit</EditorPage.Link>
```

#### Module Organization
Features are organized in `src/module/{feature}/`:
- `action.ts`: Server actions (must have `"use server"` directive)
- `*.tsx`: React components (Server Components by default)
- `component/`: Nested UI components

#### Authentication Flow
- **Server**: `src/lib/auth.ts` configures Better Auth with Drizzle adapter
- **Client**: `src/lib/auth-client.ts` provides React hooks
- **Actions**: `src/lib/auth-action.ts` exports `getSession()` for RSC
- **Protected Routes**: Wrapped in `(protected)` layout that checks session

#### Schema & Migrations
- Schema is defined in `src/db/schema.ts` using Drizzle ORM
- Relations use Drizzle's `relations()` API
- Migrations stored in `drizzle/` directory
- After schema changes, run `pnpm db:generate-migration` to create migration files

### React Component Conventions

From `.cursor/rules/react.mdc`:
- Use `type` instead of `interface` for type declarations
- Prefer function components over arrow functions
- **No default exports** - always use named exports: `export function Comp() {}`
- Use Tailwind CSS for styling components

### Multi-tenancy Model

Profiles use a many-to-many relationship with users:
- `usersToProfiles` junction table with `role` field (`"owner"` | `"collaborator"`)
- Users can own/collaborate on multiple profiles
- Profile access is validated via `profileDB.matchUserToProfile()`

### Link Management

Links belong to profiles and support:
- **Types**: `"generic"` | `"youtube"` | `"image"` | `"steam"`
- **Ordering**: Drag-and-drop reordering via `@dnd-kit`
- **Metadata Fetching**: Server-side HTML parsing to extract OpenGraph/meta tags
- **Enabled State**: Links are auto-enabled when title and URL are both present
