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

## 🧩 Core Modules & Working Detailed Explanation

### 1. Authentication & Onboarding Flow
- **Working:** Secure user authentication is managed via **Clerk**, supporting seamless social logins and email sign-ups. Upon first successful login, users are redirected to a comprehensive onboarding questionnaire.
- **Details:** The system captures essential career metrics: current industry, years of experience, core skills, and long-term career goals. This user profile is securely persisted in a PostgreSQL database via Prisma ORM. By maintaining this context, the platform acts as a personalized coach, ensuring that all AI-generated content (like resumes and roadmaps) is hyper-tailored to the individual's specific background rather than producing generic outputs.

### 2. Interactive Career Dashboard
- **Working:** The dashboard acts as the central command center for the user's career journey.
- **Details:** It features real-time, dynamic data visualizations built with **Recharts**, which display personalized industry insights, trending skills, and salary expectations based on the user's profile. The dashboard also tracks progress from the generated career roadmap and offers quick-action widgets to instantly jump into resume building, interview prep, or cover letter drafting.

### 3. AI Career Roadmap & Guidance (`/career_guide`)
- **Working:** A transformative tool that charts out a user's professional future step-by-step.
- **Details:** The user inputs a desired future job role. **Google Gemini AI** processes this along with the user's current onboarding data to dynamically generate a structured timeline. This timeline is broken down into actionable phases (e.g., 0-3 months, 3-6 months), detailing specific technical skills to learn, soft skills to develop, certifications to pursue, and key milestones to achieve. Users can interact with this roadmap visually and export it via a custom-built PDF generator (`html2pdf.js`) for offline tracking.

### 4. Smart ATS-Friendly Resume Builder (`/resume`)
- **Working:** A fully interactive, dynamic document editor engineered to bypass Applicant Tracking Systems (ATS).
- **Details:** 
  - **Live Preview Engine:** The interface provides a split-pane view where formatting changes, theme selections, and content edits are reflected instantly in a pristine, print-ready preview.
  - **AI Bullet Generation:** Users simply type a past job title, and the AI suggests high-impact, quantifiable bullet points that highlight achievements rather than just duties.
  - **CV Tailoring Engine:** One of the standout features. Users paste a specific job description they are applying for. The system analyzes the JD against the user's current resume and provides actionable recommendations to bridge skill gaps, naturally integrating required keywords into the resume to increase the chance of getting shortlisted.
  - **One-Click Export:** Generates high-quality, pixel-perfect PDFs utilizing `html2canvas` and `jsPDF`.

### 5. AI Cover Letter Generator (`/ai-cover-letter`)
- **Working:** Eliminates the tedious process of writing cover letters from scratch while ensuring high relevance to the target job.
- **Details:** The user provides a target job description and the company name. The AI seamlessly blends the user's stored profile data (experience, tone, and core strengths) with the specific requirements of the job. It drafts a compelling, professional narrative that highlights why the candidate is the perfect cultural and technical fit for the role. The generated letter can be refined in a rich text editor before final export.

### 6. Mock Interview Simulator (`/interview`)
- **Working:** An intelligent, interactive interview preparation module designed to build user confidence.
- **Details:** Based on the user's target role, the AI generates a customized set of technical and behavioral interview questions. Users can type out their answers in a simulated environment. Once submitted, the system evaluates the responses in real-time, offering a quantitative score, constructive feedback on areas of improvement, and an "ideal AI answer" to demonstrate best practices for phrasing and structuring responses.

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
