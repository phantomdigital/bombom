export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  colorTheme: string;
  href: string;
}

export const productCategories: ProductCategory[] = [
  {
    id: 'artisan-gelato',
    name: 'Artisan Gelato',
    description: 'Traditional Italian-style gelato with rotating seasonal flavours',
    image: '/images/categories/gelato.jpg',
    colorTheme: '#ed5878',
    href: '/menu/gelato'
  },
  {
    id: 'soft-serve',
    name: 'Soft Serve',
    description: 'Monthly special releases crafted with fresh seasonal ingredients',
    image: '/images/categories/soft-serve.jpg',
    colorTheme: '#f8a8c0',
    href: '/menu/soft-serve'
  },
  {
    id: 'sorbet',
    name: 'Sorbet & Granita',
    description: 'Fruit-forward refreshment, naturally dairy-free',
    image: '/images/categories/sorbet.jpg',
    colorTheme: '#ffd700',
    href: '/menu/sorbet'
  },
  {
    id: 'cakes',
    name: 'Gelato Cakes',
    description: 'Stunning layered cakes perfect for celebrations',
    image: '/images/categories/cakes.jpg',
    colorTheme: '#9b59b6',
    href: '/menu/cakes'
  },
  {
    id: 'take-home',
    name: 'Take Home',
    description: 'Premium pints to enjoy at your convenience',
    image: '/images/categories/pints.jpg',
    colorTheme: '#3498db',
    href: '/menu/take-home'
  },
  {
    id: 'desserts',
    name: 'Affogato & Desserts',
    description: 'Specialty items and coffee-based creations',
    image: '/images/categories/desserts.jpg',
    colorTheme: '#e67e22',
    href: '/menu/desserts'
  }
];

