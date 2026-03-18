import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/coming-soon",
  },
  title: "Coming Autumn",
  description:
    "We're opening in Wagga this autumn. Be first to know when we open at Shop 1, 117 Baylis St, Wagga",
  openGraph: {
    title: "BomBom Treats | Coming Autumn",
    description:
      "We're opening in Wagga this autumn. Be first to know when we open at Shop 1, 117 Baylis St, Wagga",
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
