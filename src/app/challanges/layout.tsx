import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Challenges Lab",
  robots: { index: false, follow: false },
};

export default function ChallengesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
