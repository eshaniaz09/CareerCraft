import { getUserProfile } from "@/actions/user";
import CareerGuidanceClient from "./_components/career-guidance-client";

export const metadata = {
  title: "AI Career Guidance | CareerCraft",
  description: "Get a personalized AI-powered career roadmap based on your skills, interests, and background.",
};

export default async function CareerGuidancePage() {
  // Fetch user's onboarding data from DB
  const userProfile = await getUserProfile();

  return <CareerGuidanceClient userProfile={userProfile} />;
}