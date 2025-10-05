This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## What environment variables are required for this app to run?

The app reads configuration from environment variables defined in `src/system/env.ts` and `src/module/analytics/env.ts`.

- **Required to boot the app**

  - **DATABASE_URL**: Connection string for your database (used by Drizzle ORM).

- **Authentication (NextAuth)**

  - **NEXTAUTH_SECRET**: Required when using NextAuth to sign/encrypt session tokens.
  - The following are required together only if OIDC login is enabled (all or none):
    - **AUTH_OIDC_ID**
    - **AUTH_OIDC_CLIENT_ID**
    - **AUTH_OIDC_CLIENT_SECRET**
    - **AUTH_OIDC_ISSUER**

- **Integrations (optional)**

  - **STEAM_API_KEY**: Enables Steam API features if provided.

- **Analytics (Umami, optional)**
  - **UMAMI_API_CLIENT_USER_ID**
  - **UMAMI_API_CLIENT_SECRET**
  - **UMAMI_API_ENDPOINT**
  - **UMAMI_PUBLIC_ENDPOINT**

see [.env.example](./.env.example) for more details
