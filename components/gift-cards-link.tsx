import Link from "next/link";
import { PiGiftFill } from "react-icons/pi";
import { GIFT_CARDS_LABEL, GIFT_CARDS_URL } from "@/lib/gift-cards";
import { cn } from "@/lib/utils";

type GiftCardsLinkProps = {
  className?: string;
};

export default function GiftCardsLink({ className }: GiftCardsLinkProps) {
  return (
    <Link
      href={GIFT_CARDS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center p-2 text-bom-white no-underline transition-colors hover:text-bom-dark-blue sm:p-3",
        className
      )}
      aria-label={`${GIFT_CARDS_LABEL} (opens in new tab)`}
    >
      <PiGiftFill className="size-10 shrink-0 sm:size-12 lg:size-14" />
    </Link>
  );
}
