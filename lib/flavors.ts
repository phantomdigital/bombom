export interface MonthlyFlavor {
  month: string;
  flavorName: string;
  flavorDescription?: string;
  heroSubtitle?: string;
  ingredients?: string[];
  flavorNotes?: string;
  availability?: string;
  temperature?: string;
  colorTheme?: string;
}

export const monthlyFlavors: MonthlyFlavor[] = [
  {
    month: "May",
    flavorName: "Strawberry Shortcake",
    flavorDescription: "Soft Serve",
    heroSubtitle: "Artisanal soft serve crafted with fresh seasonal strawberries and vanilla bean.",
    colorTheme: "#ed5878"
  }
];

export function getCurrentMonthFlavor(): MonthlyFlavor {
  // For now, always return the May flavor since it's our featured one
  return monthlyFlavors[0];
}

export function getFlavorByMonth(monthName: string): MonthlyFlavor | undefined {
  return monthlyFlavors.find(flavor => 
    flavor.month.toLowerCase() === monthName.toLowerCase()
  );
}
