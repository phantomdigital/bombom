import { AboutContent } from "./about-content";

export default function AboutPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative isolate flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent"
    >
      <AboutContent />
    </main>
  );
}
