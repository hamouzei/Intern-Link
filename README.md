<div align="center">
  <h1>⚡ InternLink</h1>
  <p><strong>The Next-Generation AI Internship Application & Outreach Platform</strong></p>
  <p>Eliminate cold outreach fatigue. InternLink fuses your authentic university experience with target company tech stacks to generate bespoke, high-converting pitch emails—with verified CV attachments and real-time delivery tracking.</p>

  <p>
    <a href="#-key-features">Key Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-reference">API Reference</a> •
    <a href="#-deployment">Deployment</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.1-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React-19-000000?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
    <img src="https://img.shields.io/badge/TypeScript-5-000000?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Google_Gemini-3.6_Flash-000000?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/Neon-PostgreSQL-000000?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Resend-Email-000000?style=for-the-badge&logo=resend&logoColor=white" alt="Resend" />
    <img src="https://img.shields.io/badge/Cloudinary-CDN-000000?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  </p>
</div>

---

## 💡 The Problem & The Solution

- **The Problem**: Computer science and engineering students send hundreds of copy-pasted cold emails that look like spam. Recruiters delete them in seconds because they lack context, reference no relevant projects, and attach generic filenames like `resume_final_v2(3).pdf`.
- **The Solution**: **InternLink** acts as your personal AI career agent. You set up your profile and upload your CV once. When applying to curated tech companies, our **Google Gemini 3.6 Flash** engine reads the company's verified tech stack (Node.js, Postgres, Docker, etc.) and crafts an authentic, role-targeted pitch referencing your actual GitHub projects. Applications are sent directly to HR inboxes with high-speed Cloudinary PDF attachments and live status tracking.

---

## ✨ Key Features

### 🧠 Context-Aware AI Generation (Gemini 3.6 Flash)
- Analyzes candidate skills, university projects, and target roles against company tech stacks and engineering priorities.
- Generates professional, authentic email drafts with zero generic fluff.
- Interactive live markdown editor to review, edit, or regenerate drafts before dispatch.

### 🔒 Bank-Grade Document Vault (Cloudinary CDN)
- Upload CV and University Recommendation letters once.
- Stored on high-speed CDN with authenticated server-side access.
- Built-in in-memory buffer caching: documents are cached locally upon upload, enabling **sub-second application dispatch** (0 ms retrieval latency).

### 📬 Direct In-Inbox Delivery (Resend)
- Sends authenticated emails directly from the platform.
- Configured return-path and `replyTo` headers ensure recruiter replies land directly in the student's personal email inbox.
- Automatic sandbox fallback for seamless local developer testing.

### 📊 Real-Time Application Pipeline
- Centralized tracking dashboard logging every dispatched pitch.
- Full inspection of sent email transcripts, target company details, delivery timestamps, and attachment verification.
- Built-in daily rate limiting (5 applications/day) to encourage thoughtful, high-conversion outreach.

### 🎨 Pure Monochrome Aesthetic
- Sleek, high-contrast monochrome design system (`#000000`, `#0A0A0A`, `#171717`, `#737373`, `#D4D4D4`, `#FAFAFA`).
- Built with **Tailwind CSS v4** and Google's **Plus Jakarta Sans** typography.
- Fully responsive across desktop, tablet, and mobile devices.

---

## 🏗️ Architecture

InternLink is structured as a decoupled monorepo:

```
intern-link/
├── internlink-backend/             # Express 5 API Server (Node.js)
│   ├── src/
│   │   ├── db/                     # Drizzle ORM schemas, pool connection & seeds
│   │   ├── middleware/             # Better Auth JWT verification middleware
│   │   ├── routes/                 # Express route handlers (profile, upload, companies, applications)
│   │   ├── services/               # Gemini AI, Cloudinary CDN & Resend integrations
│   │   └── index.ts                # App entrypoint & Vercel serverless export
│   ├── vercel.json                 # Vercel deployment configuration
│   └── package.json
│
├── internlink-frontend/            # Next.js 16 (React 19) Web Application
│   ├── src/
│   │   ├── app/                    # App Router (Landing, Dashboard, Profile, Applications)
│   │   ├── components/             # Reusable UI primitives (Button, Badge, Modal, Navbar)
│   │   └── lib/                    # Better Auth client, API fetch client & utility functions
│   ├── public/                     # Static assets & icons
│   └── package.json
│
└── README.md                       # Project documentation
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [Next.js 16](https://nextjs.org/) (Turbopack, App Router), [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) |
| **Backend** | [Express 5](https://expressjs.com/), [Node.js](https://nodejs.org/), [tsx](https://github.com/privatenumber/tsx) |
| **Database & ORM** | [Neon](https://neon.tech/) Serverless PostgreSQL, [Drizzle ORM](https://orm.drizzle.team/), `drizzle-kit` |
| **Authentication** | [Better Auth](https://www.better-auth.com/) (Google OAuth, GitHub OAuth, JWT sessions) |
| **AI Synthesis** | [Google Gemini 3.6 Flash](https://ai.google.dev/) (`@google/generative-ai`) |
| **Document Storage** | [Cloudinary](https://cloudinary.com/) (Raw PDF storage & CDN delivery) |
| **Email Infrastructure** | [Resend](https://resend.com/) (SPF/DKIM authenticated transactional delivery) |
| **Validation** | [Zod](https://zod.dev/) runtime schema validation on all inputs |

---

## 🚀 Getting Started

Follow these steps to run InternLink locally on your machine.

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- A free [Neon](https://neon.tech/) PostgreSQL database
- API credentials for: [Google AI Studio](https://aistudio.google.com/), [Cloudinary](https://cloudinary.com/), and [Resend](https://resend.com/)

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/intern-link.git
cd intern-link
```

---

### 2. Configure Backend (`internlink-backend`)

1. Navigate to the backend folder:
   ```bash
   cd internlink-backend
   npm install
   ```

2. Create a `.env` file in `internlink-backend/`:
   ```env
   PORT=4000
   DATABASE_URL=postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_jwt_secret_key_minimum_32_chars
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RESEND_API_KEY=re_your_resend_api_key
   EMAIL_FROM=InternLink <onboarding@resend.dev>
   DEV_FALLBACK_EMAIL=your_email@gmail.com
   FRONTEND_URL=http://localhost:3000
   ```

3. Push the database schema & seed initial companies:
   ```bash
   npm run db:push
   npm run seed
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The API will be live at `http://localhost:4000` (test with `http://localhost:4000/health`).

---

### 3. Configure Frontend (`internlink-frontend`)

1. In a new terminal, navigate to the frontend folder:
   ```bash
   cd internlink-frontend
   npm install
   ```

2. Create a `.env` file in `internlink-frontend/`:
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:4000
   BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_BASE_URL=http://localhost:3000
   BETTER_AUTH_SECRET=your_better_auth_secret_matching_backend
   DATABASE_URL=postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   GITHUB_CLIENT_ID=your_github_oauth_client_id
   GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Reference

All protected endpoints require an `Authorization: Bearer <token>` header containing a valid Better Auth session token.

### Profile & Documents
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/profile` | Yes | Retrieves the authenticated student's profile & uploaded document URLs. |
| `PUT` | `/profile` | Yes | Updates candidate bio, skills, university, target role, and portfolio links. |
| `POST` | `/upload/cv` | Yes | Uploads a PDF CV to Cloudinary and caches the buffer. |
| `POST` | `/upload/support-letter` | Yes | Uploads a PDF University Endorsement letter to Cloudinary. |

### Companies
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/companies` | Yes | Lists curated hiring companies with verified descriptions and tech stacks. |
| `POST` | `/companies` | Yes | Adds a new target company (admin/seed). |

### Applications
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/applications/generate` | Yes | Generates a bespoke cover letter using Gemini 3.6 Flash. |
| `POST` | `/applications/send` | Yes | Dispatches the application email with attached PDFs via Resend. |
| `GET` | `/applications` | Yes | Lists all past dispatched applications with timestamps and status. |

---

## 🌐 Production Deployment

Both applications are configured to deploy seamlessly to **Vercel**:

1. **Backend Deployment**:
   - In Vercel, import the repo and set the **Root Directory** to `internlink-backend`.
   - The included [`vercel.json`](file:///c:/Users/User/Documents/intern-link/internlink-backend/vercel.json) automatically routes requests to the serverless function.
   - Add backend environment variables in the Vercel project settings.

2. **Frontend Deployment**:
   - In Vercel, import the repo and set the **Root Directory** to `internlink-frontend`.
   - Vercel automatically selects the **Next.js** framework preset.
   - Add frontend environment variables, setting `NEXT_PUBLIC_API_URL` to your live backend domain.

3. **OAuth Redirect Configuration**:
   - In **Google Cloud Console**, add your production domain to Authorized JavaScript Origins and Redirect URIs (`https://<your-frontend>.vercel.app/api/auth/callback/google`).
   - In **GitHub Developer Settings**, update your OAuth app's Homepage URL and Callback URL (`https://<your-frontend>.vercel.app/api/auth/callback/github`).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

<div align="center">
  <sub>Built with ❤️ for ambitious university students and emerging engineers.</sub>
</div>
