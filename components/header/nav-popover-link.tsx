"use client";

import { useState, type ComponentType, type MouseEvent, type PointerEvent } from "react";
import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { focusRing, focusRingInset } from "@/components/ui/focus-ring";
import { cn } from "@/lib/utils";
import type { HeaderPopoverManager } from "./hooks/useHeaderPopoverManager";

export type NavPopoverItem = {
  href: string;
  label: string;
  description?: string;
};

export type NavPopoverMegaGroup = {
  href: string;
  label: string;
  description: string;
  imageLabel?: string;
  /**
   * Mega hero fill: BOM solid background (Tailwind `bg-bom-*`).
   */
  heroTintClassName?: string;
  items?: NavPopoverItem[];
  icon?: ComponentType<{
    size?: number;
    weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
    className?: string;
    "aria-hidden"?: boolean;
  }>;
};

export type NavPopoverConfig =
  | {
  variant: "mega";
  groups: NavPopoverMegaGroup[];
  label?: string;
  panelClassName?: string;
}
  | {
  variant: "compact";
  items: NavPopoverItem[];
  label?: string;
  panelClassName?: string;
};

type NavPopoverLinkProps = {
  href: string;
  label: string;
  className?: string;
  popover?: NavPopoverConfig;
  manager: HeaderPopoverManager;
  interactionDisabled?: boolean;
};

/** Default BOM hero fill when group omits `heroTintClassName`. */
const DEFAULT_MEGA_TINT_CLASS = "bg-bom-dark-blue";

/** Space between nav trigger and panel; `sideOffset` is applied by Radix (safe vs custom transform hacks). */
const POPOVER_SIDE_OFFSET_COMPACT = 24;
const POPOVER_SIDE_OFFSET_MEGA = 32;

const popoverItemClass =
  cn(
    "group rounded-xl px-7 py-5 transition-colors hover:bg-neutral-200 focus-visible:bg-neutral-200",
    focusRing
  );

export default function NavPopoverLink({
  href,
  label,
  className,
  popover,
  manager,
  interactionDisabled = false,
}: NavPopoverLinkProps) {
  const [activeMegaIndex, setActiveMegaIndex] = useState(0);

  const hasPopover = popover
    ? popover.variant === "mega"
      ? popover.groups.length > 0
      : popover.items.length > 0
    : false;
  const open =
    hasPopover && !interactionDisabled && manager.activeHref === href;
  const activeMegaGroup =
    popover?.variant === "mega" ? popover.groups[activeMegaIndex] : null;

  function handleWrapperPointerEnter() {
    if (!hasPopover || interactionDisabled) return;
    manager.open(href);
  }

  function handleWrapperPointerLeave() {
    manager.scheduleClose();
  }

  function handleTriggerClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!hasPopover || interactionDisabled) return;
    manager.toggle(href);
  }

  function handleTriggerPointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "mouse" || event.pointerType === "touch") {
      event.preventDefault();
    }
  }

  function handleContentClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (interactionDisabled) return;
    if (!target.closest("a[href]")) return;
    manager.close();
  }

  function handleEscape(event: { key: string }) {
    if (event.key === "Escape") manager.close();
  }

  if (!hasPopover || !popover) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  const megaHeroTintClass =
    popover.variant === "mega" && activeMegaGroup?.heroTintClassName
      ? activeMegaGroup.heroTintClassName
      : DEFAULT_MEGA_TINT_CLASS;

  return (
    <Popover
      open={open}
      modal={false}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          if (!interactionDisabled) manager.open(href);
        } else {
          manager.close();
        }
      }}
    >
      <span
        className="inline-flex"
        onPointerEnter={handleWrapperPointerEnter}
        onPointerLeave={handleWrapperPointerLeave}
        onKeyDown={handleEscape}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              className,
              "cursor-pointer"
            )}
            aria-haspopup="menu"
            aria-expanded={open}
            disabled={interactionDisabled}
            onPointerDown={handleTriggerPointerDown}
            onClick={handleTriggerClick}
          >
            {label}
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align={popover.variant === "mega" ? "center" : "start"}
          sideOffset={
            popover.variant === "mega"
              ? POPOVER_SIDE_OFFSET_MEGA
              : POPOVER_SIDE_OFFSET_COMPACT
          }
          onOpenAutoFocus={(event) => event.preventDefault()}
          onPointerEnter={() => manager.cancelClose()}
          onPointerLeave={() => manager.scheduleClose()}
          onClickCapture={handleContentClick}
          className={cn(
            popover.variant === "mega"
              ? "!fixed !left-[calc(50%+1.25rem)] !w-[min(calc(100vw-2rem),87.5rem)] !-translate-x-1/2 !translate-y-0 p-9"
              : "w-max min-w-48 p-5",
            popover.panelClassName
          )}
        >
          {popover.variant === "mega" ? (
            <div className="-m-9 grid min-h-[25rem] grid-cols-[minmax(18rem,32rem)_1fr]">
              <div className="py-9 pl-5 pr-4">
                <div className="flex flex-col gap-1.5">
                  {popover.groups.map((group, index) => (
                    <Link
                      key={group.href}
                      href={group.href}
                      onPointerEnter={() => setActiveMegaIndex(index)}
                      onFocus={() => setActiveMegaIndex(index)}
                      className={cn(
                        popoverItemClass,
                        "flex items-center justify-between gap-4",
                        activeMegaIndex === index && "bg-neutral-200"
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        {group.icon ? (
                          <span className="flex size-9 shrink-0 items-center justify-center">
                            <group.icon
                              size={30}
                              weight="light"
                              aria-hidden
                              className="block text-bom-black/80 transition-colors group-hover:text-bom-black"
                            />
                          </span>
                        ) : null}
                        <span className="block truncate font-sans text-xl font-medium leading-none tracking-normal antialiased text-bom-black/80 transition-colors group-hover:text-bom-black">
                          {group.label}
                        </span>
                      </span>
                      <CaretRightIcon
                        size={18}
                        aria-hidden
                        className="shrink-0 text-bom-black/40 transition-colors group-hover:text-bom-black"
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {activeMegaGroup ? (
                <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(17rem,23rem)] items-start gap-9 bg-neutral-50 p-9">
                  <div className="flex h-full min-w-0 flex-col">
                    <h3 className="font-sans text-3xl font-medium leading-none tracking-tight text-bom-black">
                      {activeMegaGroup.label}
                    </h3>
                    <p className="mt-4 max-w-lg font-sans text-base leading-snug text-bom-black/65">
                      {activeMegaGroup.description}
                    </p>

                    {activeMegaGroup.items?.length ? (
                      <div className="mt-7 grid gap-2">
                        {activeMegaGroup.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "rounded-xl px-4 py-3 font-sans text-sm font-medium leading-none text-bom-black/80 transition-colors hover:bg-neutral-200 hover:text-bom-black focus-visible:bg-neutral-200",
                              focusRing
                            )}
                          >
                            <span className="block">{item.label}</span>
                            {item.description ? (
                              <span className="mt-2 block text-xs leading-snug text-bom-black/50">
                                {item.description}
                              </span>
                            ) : null}
                          </Link>
                        ))}
                      </div>
                    ) : null}

                    <Link
                      href="/menu"
                      className={cn(
                        "mt-auto inline-flex w-fit rounded-xl px-4 py-3 font-sans text-sm font-medium leading-none text-bom-black/70 transition-colors hover:bg-neutral-200 hover:text-bom-black focus-visible:bg-neutral-200",
                        focusRing
                      )}
                    >
                      View full menu
                    </Link>
                  </div>

                  <Link
                    href={activeMegaGroup.href}
                    aria-label={`${activeMegaGroup.label} collection`}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-[1.25rem] bg-bom-ice",
                      focusRingInset,
                      megaHeroTintClass
                    )}
                  >
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <img
                        src="/images/optim.png"
                        alt=""
                        width={820}
                        height={820}
                        className="h-auto max-h-[min(38rem,calc(100%-2rem))] w-auto max-w-[min(100%,28rem)] object-contain drop-shadow-sm"
                      />
                    </span>
                  </Link>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col">
              {popover.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-6 py-5 font-sans text-base font-medium leading-none whitespace-nowrap text-bom-black/80 transition-colors hover:bg-neutral-200 hover:text-bom-black focus-visible:bg-neutral-200",
                    focusRing
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </PopoverContent>
      </span>
    </Popover>
  );
}
