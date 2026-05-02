import { StoryContent } from "./story-content";

export default function StoryPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative isolate flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent"
    >
      <StoryContent />
    </main>
  );
}
