// src/types.ts

export interface Book {
  id: number;
  title: string;
  category: string;
  price: string;
  pages: string;
  badge: string | null;
  imageUrl: string;
  checkoutUrl: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}
