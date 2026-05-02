import { SpecialsContent } from "./specials-content";

export default function SpecialsPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative isolate flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent"
    >
      <SpecialsContent />
    </main>
  );
}
