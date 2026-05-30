# 🚀 CareerCraft - Your AI-Powered Career Coach

[![Live Demo](https://img.shields.io/badge/Demo-Live_Website-blue?style=for-the-badge)](https://ai-career-coach-two-cyan.vercel.app/)

**CareerCraft** is an advanced, AI-driven career guidance platform built to empower job seekers and professionals. It provides intelligent tools for resume building, cover letter generation, interview preparation, and personalized career roadmaps.

---

## 🌐 Live Website
**Experience CareerCraft here:** [https://ai-career-coach-two-cyan.vercel.app/](https://ai-career-coach-two-cyan.vercel.app/)

---

## 🎯 Purpose of the Project
Navigating today's job market can be overwhelming. CareerCraft aims to bridge the gap between talent and opportunity by providing an all-in-one, intelligent career assistant. Whether you're a recent graduate figuring out your first steps, or an experienced professional looking to pivot, CareerCraft offers personalized, actionable insights using the power of Generative AI.

---

## ⚙️ Tech Stack
CareerCraft is built using modern web technologies to ensure a scalable, fast, and responsive user experience.

- **Frontend:** Next.js 16 (App Router), React 18, Tailwind CSS
- **Backend/API:** Next.js Server Actions, Prisma ORM
- **Database:** PostgreSQL (via Prisma)
- **Authentication:** Clerk
- **AI Integration:** Google Gemini AI
- **UI Components:** Radix UI, Shadcn UI
- **Form Handling & Validation:** React Hook Form & Zod
- **Data Visualization:** Recharts
- **Background Jobs:** Inngest
- **PDF Generation:** html2pdf.js, jsPDF

---

## 🧩 Core Modules & Working

### 1. Authentication & Onboarding
Secure user authentication is managed via **Clerk**. Upon first login, users go through a tailored onboarding flow where they input their current industry, experience level, and future career goals. The system securely saves this profile and uses it to personalize all subsequent AI interactions.

### 2. Interactive Dashboard
The central hub for the user. It aggregates live industry trends, displays progress on their generated career roadmap, and provides quick navigation to the core tools. Data visualization is beautifully rendered using **Recharts**.

### 3. AI Career Roadmap & Guidance (`/career_guide`)
Users can generate a dynamic, step-by-step career roadmap. By analyzing the user's profile and desired job role, **Google Gemini AI** creates a customized timeline including learning paths, essential skills to acquire, and key milestones. Users can interact with this roadmap and download it as a PDF for offline reference.

### 4. Smart Resume Builder (`/resume`)
A fully interactive and dynamic resume builder designed to beat ATS (Applicant Tracking Systems). 
- **Live Preview:** See layout and formatting changes in real-time.
- **AI Bullet Generation:** Generate high-impact bullet points for work experiences based on job titles.
- **CV Tailoring:** Paste a specific job description, and the AI will automatically suggest resume modifications to highlight matching skills.
- **Export:** High-quality, one-click PDF export using `html2pdf.js`.

### 5. AI Cover Letter Generator (`/ai-cover-letter`)
Eliminates writer's block by automatically drafting professional, customized cover letters. Users simply provide a target job description, and the AI seamlessly blends their existing profile data with the job requirements to craft a compelling narrative.

### 6. Mock Interview Simulator (`/interview`)
An intelligent interview preparation module. The AI generates role-specific interview questions based on the user's target job. Users can provide their answers via text, and the system evaluates their responses, offering constructive feedback, scoring, and actionable suggestions for improvement.

---

## 🚀 Getting Started Locally

To run this project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd AI-Career-Coach-Site
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add the necessary API keys for:
   - Clerk (Authentication)
   - Prisma Database URL
   - Google Gemini API Key
   - Inngest Event Key

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 License & Credits
Developed as a comprehensive final year project. 
All rights reserved.
