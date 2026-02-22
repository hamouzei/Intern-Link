<div align="center">
  <img src="https://i.ibb.co/6w2z29X/Intern-Link-Logo.png" alt="InternLink Logo" width="200" height="auto" />
  <h1>🚀 InternLink</h1>
  <p><strong>The Next-Gen Internship Application Platform</strong></p>
  <p>Streamline your internship hunt. Auto-generate tailored cover letters with AI, track your applications in real-time, and manage conversations seamlessly in one unified dashboard.</p>
</div>

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-yellow?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)

</div>

---

## ✨ Features

- **🤖 AI-Powered Applications:** Generate personalized emails and support letters tailored exactly to the company and role you are applying for, powered by Google's Gemini AI.
- **📧 Seamless Email Delivery:** Built-in integration with **Resend**. Your automated internship applications land securely in HR inboxes with high deliverability.
- **💬 Real-time Threading:** Our proprietary **Inbound Webhook Engine** automatically intercepts and links company replies to your student dashboard. Chat with HR without ever checking your Gmail!
- **🔐 Secure Authentication:** Next-gen security utilizing **Better Auth** for robust session and credential management.
- **☁️ Cloud Storage:** Store your CVs, portfolios, and university support letters securely in **Cloudinary**.
- **🎨 "Soft Luxury" UI Aesthetic:** A buttery smooth, high-end user interface built using **Tailwind CSS v4** and **Framer Motion** animations.

---

## 🏗️ Architecture

InternLink utilizes a modern decoupled monorepo structure.

### 🌐 Frontend (`/internlink-frontend`)
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Authentication Client**: Better Auth
- **UI Components**: Radix & Custom Components (Shadcn-inspired)

### ⚙️ Backend (`/internlink-backend`)
- **Framework**: Express.js 5 / Node.js
- **Database**: PostgreSQL (hosted on Neon)
- **ORM**: Drizzle ORM
- **AI**: `@google/generative-ai` (Gemini)
- **File Uploads**: Cloudinary + Multer
- **Email Provider**: Resend (Outbound & Inbound Webhooks)
- **Security**: Svix (Webhook Verification)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/InternLink.git
cd InternLink
```

### 2. Configure Environment Variables
Both applications require their own `.env` files.

**Backend (`/internlink-backend/.env`)**
```env
PORT=4000
DATABASE_URL=postgresql://...
GEMINI_API_KEY=your_gemini_key
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
BETTER_AUTH_SECRET=your_better_auth_secret
RESEND_API_KEY=your_resend_key
RESEND_WEBHOOK_SECRET=your_svix_webhook_secret
```

**Frontend (`/internlink-frontend/.env.local`)**
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
BETTER_AUTH_BASE_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret
```

### 3. Install Dependencies & Run

#### Backend Setup
```bash
cd internlink-backend
npm install
npm run db:push    # Push Drizzle schema to Neon DB
npm run seed       # Seed initial company data
npm run dev        # Starts API on localhost:4000
```

#### Frontend Setup
```bash
cd internlink-frontend
npm install
npm run dev        # Starts Next.js app on localhost:3000
```

### 4. Setup Inbound Email Webhooks (Local Testing)
To test the conversation messaging threading locally:
1. Start ngrok forwarding to your local backend: `ngrok http 4000`
2. Configure **Resend** to point its Inbound Webhook to your Ngrok URL (`https://<ngrok-id>.ngrok.app/webhooks/resend/inbound`)
3. Grab the Svix Signing Secret from Resend and add it to your Backend `.env` as `RESEND_WEBHOOK_SECRET`.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the ISC License.
