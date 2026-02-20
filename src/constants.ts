// src/constants.ts
import type { Book, Stat } from './types';
import Image from './assets/images/image.jpg'
import Image2 from './assets/images/image2.jpg'
import Image3 from './assets/images/image3.jpg'
import Image4 from './assets/images/image4.jpg'
export const BOOKS: Book[] = [
  { 
    id: 1, 
    title: "O Código Alfa",  
    category: "Liderança",  
    price: "R$ 29,90", 
    pages: "10 páginas", 
    badge: "Mais Vendido",
    imageUrl: Image,
    checkoutUrl: "https://pay.kiwify.com.br/RPBdI3D"
  },
  { 
    id: 2, 
    title: "Finanças Pessoais na Prática",    
    category: "Liderança",      
    price: "R$ 24,90", 
    pages: "12 páginas", 
    badge: "Novo",
    imageUrl: Image2,
    checkoutUrl: "https://pay.kiwify.com.br/RPBdI3D"
  },
  { 
    id: 3, 
    title: "Liderança Sem Título",             
    category: "Liderança",     
    price: "R$ 34,90", 
    pages: "10 páginas", 
    badge: null,
    imageUrl: Image3,
    checkoutUrl: "https://pay.kiwify.com.br/RPBdI3D"
  },
  { 
    id: 4, 
    title: "Foco: A Arte de Não se Distrair", 
    category: "Liderança",  
    price: "R$ 27,90", 
    pages: "12 páginas", 
    badge: "Destaque",
    imageUrl: Image4,
    checkoutUrl: "https://pay.kiwify.com.br/RPBdI3D"
  },
];

export const STATS: Stat[] = [
  { value: "12+", label: "Títulos"   },
  { value: "4.9", label: "Avaliação" },
  { value: "3k+", label: "Leitores"  },
];

export const NAV_LINKS  = ["Ebooks", "Sobre", "Contato"] as const;
export const FOOT_LINKS = ["Termos", "Privacidade", "Contato"] as const;
