import { productCategories } from "@/lib/categories";

export type HeaderNavIconKey = "iceCream" | "cake" | "coffee";

export type HeaderNavPopoverItem = {
  href: string;
  label: string;
  description?: string;
};

export type HeaderNavPopoverMegaGroup = {
  href: string;
  label: string;
  description: string;
  imageLabel?: string;
  heroTintClassName?: string;
  items?: HeaderNavPopoverItem[];
  iconKey?: HeaderNavIconKey;
};

export type HeaderNavPopoverConfig =
  | {
      variant: "mega";
      groups: HeaderNavPopoverMegaGroup[];
      label?: string;
      panelClassName?: string;
    }
  | {
      variant: "compact";
      items: HeaderNavPopoverItem[];
      label?: string;
      panelClassName?: string;
    };

export type HeaderNavItem = {
  href: string;
  label: string;
  popover?: HeaderNavPopoverConfig;
};

export const DEFAULT_HEADER_NAV_ITEMS: HeaderNavItem[] = [
  {
    href: "/menu",
    label: "Menu",
    popover: {
      variant: "mega",
      groups: [
        {
          href: "/menu/soft-serve",
          label: "Soft serve",
          description: "Swirls, drops, and seasonal flavours.",
          imageLabel: "Soft serve placeholder",
          heroTintClassName: "bg-bom-ice",
          iconKey: "iceCream",
          items: [
            {
              href: "/menu/soft-serve",
              label: "Monthly flavour",
              description: "The current swirl on rotation.",
            },
            {
              href: "/specials",
              label: "Limited specials",
              description: "Short-run flavours and launch treats.",
            },
          ],
        },
        {
          href: "/menu/cakes",
          label: "Cakes & celebrations",
          description: "Gelato cakes and party-ready treats.",
          imageLabel: "Cake placeholder",
          heroTintClassName: "bg-bom-violet",
          iconKey: "cake",
          items: [
            {
              href: "/menu/cakes",
              label: "Gelato cakes",
              description: "Layered cakes for birthdays and events.",
            },
            {
              href: "/menu/take-home",
              label: "Take-home tubs",
              description: "Treats for the freezer.",
            },
          ],
        },
        {
          href: "/menu/desserts",
          label: "Coffee & desserts",
          description: "Affogato, coffee, and sweet extras.",
          imageLabel: "Dessert placeholder",
          heroTintClassName: "bg-bom-orange",
          iconKey: "coffee",
          items: productCategories.slice(3).map((category) => ({
            href: category.href,
            label: category.name,
            description: category.description,
          })),
        },
      ],
    },
  },
  {
    href: "/specials",
    label: "Specials",
    popover: {
      variant: "compact",
      items: [
        { href: "/specials", label: "Monthly specials" },
        { href: "/menu/soft-serve", label: "Soft serve drops" },
        { href: "/menu/cakes", label: "Celebration cakes" },
      ],
    },
  },
  {
    href: "/story",
    label: "Story",
    popover: {
      variant: "compact",
      items: [
        { href: "/story", label: "About BomBom" },
        { href: "/story#ingredients", label: "Ingredients" },
        { href: "/story#community", label: "Community" },
      ],
    },
  },
  {
    href: "/locations",
    label: "Visit",
    popover: {
      variant: "compact",
      items: [
        { href: "/locations", label: "Wagga Wagga store" },
        { href: "/locations#hours", label: "Opening hours" },
        { href: "/locations#contact", label: "Contact" },
      ],
    },
  },
];
