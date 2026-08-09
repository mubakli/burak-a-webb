import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual Trade Lab",
  robots: { index: false, follow: false },
};

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
