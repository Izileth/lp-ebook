// src/types.ts

export interface ProductImage {
  id: number;
  image_url: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  badge: string | null;
  pages: string;
  product_images: ProductImage[];
  checkoutUrl: string; // Assuming this is still needed
}


export interface Book {
  id: number;
  title: string;
  category: string;
  price: string;
  pages: string;
  badge: string | null;
  imageUrl: string;
  checkoutUrl:string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}
