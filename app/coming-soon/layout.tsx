import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon",
  description:
    "BomBom Treats is opening in Wagga this autumn. Sign up to be first to know when we open at Shop 1, 117 Baylis St.",
  openGraph: {
    title: "BomBom Treats | Coming Autumn",
    description:
      "Sign up to be first to know when BomBom Treats opens at Shop 1, 117 Baylis St, Wagga.",
  },
};

export default function ComingSoonLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-bom-ice flex flex-col">
      {children}
    </div>
  );
}
