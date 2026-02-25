// src/types.ts

export interface ProductImage {
  id: number;
  image_url: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  badge: string | null;
  pages: string;
  product_images: ProductImage[];
  checkoutUrl?: string;
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

export interface Profile {
  id: string; // UUID from auth.users.id
  name: string;
  email: string;
  slug: string;
  bio?: string; // New field for user bio
  extra_info?: Record<string, unknown>; // JSONB type, can be any JSON object
  created_at: string;
  updated_at: string;
}
