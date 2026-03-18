export default function ComingSoonLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-bom-ice flex flex-col">
      {children}
    </div>
  );
}
