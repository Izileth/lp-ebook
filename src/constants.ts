// src/constants.ts
import type { Book, Stat } from './types';

export const BOOKS: Book[] = [
  { id: 1, title: "Mentalidade de Alto Desempenho",  category: "Produtividade", price: "R$ 29,90", pages: "187 páginas", badge: "Mais Vendido" },
  { id: 2, title: "Finanças Pessoais na Prática",    category: "Finanças",      price: "R$ 24,90", pages: "142 páginas", badge: "Novo"        },
  { id: 3, title: "Liderança Sem Título",             category: "Liderança",     price: "R$ 34,90", pages: "210 páginas", badge: null          },
  { id: 4, title: "Foco: A Arte de Não se Distrair", category: "Produtividade", price: "R$ 27,90", pages: "165 páginas", badge: "Destaque"    },
];

export const STATS: Stat[] = [
  { value: "12+", label: "Títulos"   },
  { value: "4.9", label: "Avaliação" },
  { value: "3k+", label: "Leitores"  },
];

export const NAV_LINKS  = ["Ebooks", "Sobre", "Contato"] as const;
export const FOOT_LINKS = ["Termos", "Privacidade", "Contato"] as const;
