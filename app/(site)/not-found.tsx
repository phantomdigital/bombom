import SitePlaceholderContent from "./_components/site-placeholder-content";

export default function SiteNotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative isolate flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent"
    >
      <SitePlaceholderContent
        eyebrow="404"
        title="Page not found"
        href="/menu"
        label="View the menu"
        notFoundShellTypography
        buttonClassName="bg-bom-black text-bom-white border-0 font-sans font-medium antialiased shadow-none hover:brightness-95 motion-reduce:hover:brightness-100 w-full lg:w-auto lg:whitespace-nowrap items-center justify-center"
      />
    </main>
  );
}
