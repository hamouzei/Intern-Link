# InternLink — Vercel Deployment & Production Walkthrough

This guide provides a step-by-step walkthrough for deploying both the **Backend** (`internlink-backend`) and **Frontend** (`internlink-frontend`) to [Vercel](https://vercel.com), configuring environment variables, and updating OAuth redirect URLs for **Google** and **GitHub**.

---

## 📑 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Step 1: Deploy the Backend to Vercel](#step-1-deploy-the-backend-to-vercel)
3. [Step 2: Deploy the Frontend to Vercel](#step-2-deploy-the-frontend-to-vercel)
4. [Step 3: Update Google OAuth Credentials](#step-3-update-google-oauth-credentials)
5. [Step 4: Update GitHub OAuth Credentials](#step-4-update-github-oauth-credentials)
6. [Step 5: Cross-Connect Backend and Frontend URLs](#step-5-cross-connect-backend-and-frontend-urls)
7. [Environment Variables Reference](#environment-variables-reference)
8. [Performance & Dispatch Optimizations](#performance--dispatch-optimizations)
9. [Troubleshooting & Gotchas](#troubleshooting--gotchas)

---

## 1. Architecture Overview

InternLink is structured as a decoupled monorepo:

```
intern-link/
├── internlink-backend/       # Express 5 Serverless API (Node.js)
│   ├── vercel.json           # Vercel Serverless configuration
│   └── src/index.ts          # Exports app for Vercel functions
└── internlink-frontend/      # Next.js 16 (React 19) Application
    └── src/app/              # App Router, Better Auth endpoints & UI
```

On Vercel, you will create **two separate projects** pointing to the same GitHub repository, but with different **Root Directory** settings.

---

## Step 1: Deploy the Backend to Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com) and click **"Add New..." → "Project"**.
2. Select your `intern-link` GitHub repository.
3. In the project setup screen:
   - **Project Name**: `internlink-backend` (or your preferred name).
   - **Framework Preset**: Select **Other**.
   - **Root Directory**: Click **Edit** and select `internlink-backend`.
4. Open the **Environment Variables** section and add the following:

| Variable | Value | Notes |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` | Your Neon PostgreSQL connection string |
| `GEMINI_API_KEY` | `AQ.Ab8RN...` | Google AI Studio API key for Gemini 3.6 |
| `JWT_SECRET` | `your_jwt_secret` | Secret string for signing session JWTs |
| `CLOUDINARY_CLOUD_NAME` | `ka5svehi` | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | `511986179257827` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | `thDxs8nsE05n4UD1PItUjYEONZA` | Cloudinary API Secret |
| `RESEND_API_KEY` | `re_...` | Resend email dispatch API key |
| `EMAIL_FROM` | `InternLink <onboarding@resend.dev>` | Or your verified domain email (e.g. `careers@yourdomain.com`) |
| `DEV_FALLBACK_EMAIL` | `hammada3971@gmail.com` | Verified recipient for Resend sandbox testing |
| `FRONTEND_URL` | `http://localhost:3000` | Temporary; you will update this in Step 5 |

5. Click **"Deploy"**.
6. Once deployment finishes, copy your live **Backend URL** (e.g., `https://internlink-backend.vercel.app`).
   - You can test it by opening `https://internlink-backend.vercel.app/health` in your browser. It should return `{"status":"ok", ...}`.

---

## Step 2: Deploy the Frontend to Vercel

1. Return to your Vercel Dashboard and click **"Add New..." → "Project"**.
2. Select the same `intern-link` repository again.
3. In the project setup screen:
   - **Project Name**: `internlink-frontend` (or `internlink`).
   - **Framework Preset**: **Next.js** (Vercel automatically detects this).
   - **Root Directory**: Click **Edit** and select `internlink-frontend`.
4. Open the **Environment Variables** section and add:

| Variable | Value | Notes |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_BASE_URL` | `https://internlink-frontend.vercel.app` | Use your actual production frontend URL |
| `NEXT_PUBLIC_API_URL` | `https://internlink-backend.vercel.app` | Point to your backend URL from Step 1 |
| `BETTER_AUTH_URL` | `https://internlink-frontend.vercel.app` | Must match your production frontend URL exactly |
| `BETTER_AUTH_BASE_URL` | `https://internlink-frontend.vercel.app` | Must match your production frontend URL exactly |
| `BETTER_AUTH_SECRET` | `sTiXfBSHvu7KT37WMu7YYj79PGrIBnKn` | Same secret used in local setup |
| `DATABASE_URL` | `postgresql://...` | Same Neon connection string used by Better Auth |
| `GOOGLE_CLIENT_ID` | `181098894582-...` | Your Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` | Your Google OAuth Client Secret |
| `GITHUB_CLIENT_ID` | `Ov23...` | Your GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | `4c5e...` | Your GitHub OAuth Client Secret |

5. Click **"Deploy"**.
6. Once deployment finishes, note your **Frontend URL** (e.g., `https://internlink-frontend.vercel.app`).

---

## Step 3: Update Google OAuth Credentials

To enable Google Sign-In on production without getting `Access blocked: This app's request is invalid`:

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project and navigate to **APIs & Services → Credentials**.
3. Under **OAuth 2.0 Client IDs**, click on your Web Client credentials.
4. Update the following fields:
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (keep for local development)
     - `https://internlink-frontend.vercel.app` *(Add your live frontend Vercel URL)*
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (keep for local development)
     - `https://internlink-frontend.vercel.app/api/auth/callback/google` *(Add your production callback URL)*
5. Click **Save**.
   > **Note**: Google changes usually propagate in 1 to 5 minutes.

---

## Step 4: Update GitHub OAuth Credentials

To enable GitHub login on production without getting redirect mismatch errors:

1. Open your GitHub account and navigate to **Settings → Developer settings → OAuth Apps**.
2. Select your existing OAuth Application (or create a new one named `InternLink Production`).
3. Update the URLs:
   - **Homepage URL**:
     ```
     https://internlink-frontend.vercel.app
     ```
   - **Authorization callback URL**:
     ```
     https://internlink-frontend.vercel.app/api/auth/callback/github
     ```
4. Click **Update application**.

---

## Step 5: Cross-Connect Backend and Frontend URLs

Now that both domains are live:

1. Go to your **`internlink-backend`** project in the Vercel Dashboard:
   - Navigate to **Settings → Environment Variables**.
   - Update `FRONTEND_URL` to:
     ```
     https://internlink-frontend.vercel.app
     ```
   - Trigger a Redeploy (under **Deployments → ... → Redeploy**) so the backend loads the new variable.

2. Go to your **`internlink-frontend`** project in the Vercel Dashboard:
   - Verify that `NEXT_PUBLIC_API_URL` points to your live backend:
     ```
     https://internlink-backend.vercel.app
     ```
   - Verify that `NEXT_PUBLIC_BASE_URL` and `BETTER_AUTH_URL` point to your live frontend:
     ```
     https://internlink-frontend.vercel.app
     ```

---

## Performance & Dispatch Optimizations

We implemented high-performance optimizations in the backend to ensure sending applications is fast and responsive:

1. **In-Memory Document Caching**:
   - When a student uploads their CV or University letter, the PDF buffer is immediately cached in memory.
   - Clicking "Apply" and sending the application loads the buffers in **0 ms**, eliminating redundant Cloudinary downloads.
2. **Bundled Single-Archive Downloads**:
   - If cache expires, both files are bundled and downloaded in a single Cloudinary archive request rather than two separate sequential calls (cutting download latency by over 3.5x).
3. **Direct Sandbox Delivery**:
   - In Resend sandbox mode (`onboarding@resend.dev`), emails are routed directly to the verified developer inbox in a single HTTP request, eliminating 4 to 6 seconds of doomed 403 retries.
4. **Parallel Database Queries**:
   - Rate limit verification, profile retrieval, document hydration, and company details are queried concurrently with `Promise.all`.

---

## Troubleshooting & Gotchas

### 1. "Origin not allowed" / CORS Errors
- The backend in `src/index.ts` is configured to allow `FRONTEND_URL`, `http://localhost:3000`, and any `*.vercel.app` preview domain.
- Ensure your frontend sends requests with `credentials: "include"`.

### 2. Google OAuth: "redirect_uri_mismatch"
- Double check that the URI in Google Cloud Console is exact:
  - Protocol must be `https://`
  - Path must be `/api/auth/callback/google`
  - No trailing slash.

### 3. Better Auth Session Missing on Backend
- Better Auth writes session cookies on the frontend domain.
- When calling the backend API, the frontend includes the bearer token from the session in the `Authorization: Bearer <token>` header.
- Ensure `NEXT_PUBLIC_API_URL` does not have a trailing slash.

### 4. Neon PostgreSQL SSL Connections
- Neon requires SSL. Ensure your `DATABASE_URL` ends with `?sslmode=require`.

---

© 2026 InternLink. Built for ambitious students and developers.
