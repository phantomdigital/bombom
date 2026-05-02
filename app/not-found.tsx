import Link from "next/link";
import BomBomLogo from "@/components/bombom-logo";
import { Button } from "@/components/ui/button";
import { focusRing } from "@/components/ui/focus-ring";
import { cn } from "@/lib/utils";

const pillOutline =
  "inline-flex shrink-0 font-sans font-medium antialiased w-full lg:w-auto lg:whitespace-nowrap items-center justify-center bg-bom-black text-bom-white hover:brightness-[0.92] motion-reduce:hover:brightness-100 border-0 shadow-none";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-bom-marble text-bom-black">
      <header className="flex justify-center px-5 pb-4 pt-10 sm:justify-start sm:px-10 sm:pb-6 sm:pt-12 lg:px-16">
        <Link
          href="/"
          className={cn("rounded-full outline-offset-[6px]", focusRing)}
          aria-label="BomBom Treats home"
        >
          <BomBomLogo variant="dark" className="h-8 w-auto sm:h-9 lg:h-10" />
        </Link>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col items-center justify-center gap-8 px-5 pb-24 text-center sm:px-10 lg:px-16"
      >
        <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-bom-black/65">
          404
        </p>
        <h1 className="font-sans text-4xl font-medium tracking-tight text-bom-black sm:text-5xl lg:text-6xl">
          Page not found
        </h1>
        <p className="max-w-xl font-sans text-base leading-relaxed text-bom-black/75 sm:text-lg">
          There isn&apos;t a page here. Head home or browse the menu.
        </p>
        <Button variant="bomPill" size="bomPill" asChild className={pillOutline}>
          <Link href="/menu">View the menu</Link>
        </Button>
      </main>
    </div>
  );
}
