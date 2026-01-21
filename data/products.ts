
import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Pagne Wax Holandais Premium - Collection Royale',
    description: 'Pagne de haute qualité, 6 yards, motifs traditionnels vibrants. Idéal pour cérémonies.',
    price: 35000,
    category: 'Mode & Textile',
    image: 'https://images.unsplash.com/photo-1590736961918-011d67019f81?auto=format&fit=crop&q=80&w=800',
    sellerId: 's1',
    sellerName: 'Maman Wax Lomé',
    rating: 4.8,
    reviewsCount: 2,
    verifiedSeller: true,
    isSponsored: true,
    stock: 2,
    discount: 10,
    createdAt: '2024-03-20T10:00:00Z',
    sellingType: 'retail',
    variants: [
      { id: 'v1', color: 'Bleu Royal', size: '6 Yards', stock: 1 },
      { id: 'v2', color: 'Or Mystique', size: '6 Yards', stock: 1 }
    ],
    reviews: [
      { id: 'r1', author: 'Koffi A.', rating: 5, comment: 'Qualité exceptionnelle, les couleurs ne fanent pas.', date: '2024-04-01T10:00:00Z' },
      { id: 'r2', author: 'Amévi S.', rating: 4, comment: 'Très beau mais un peu cher.', date: '2024-04-05T12:30:00Z' }
    ]
  },
  {
    id: 'p2',
    name: 'Pack 100 Chemises en Lin - Kpalimé Export',
    description: 'Vente en gros. Chemises légères faites main, lin 100% naturel. Parfait pour revendeurs.',
    price: 850000,
    category: 'B2B / Gros',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    sellerId: 's2',
    sellerName: 'Artisans du Grand Kloto',
    rating: 4.9,
    reviewsCount: 1,
    verifiedSeller: true,
    stock: 5,
    createdAt: '2024-03-18T14:30:00Z',
    sellingType: 'wholesale',
    minOrderQuantity: 10,
    reviews: [
      { id: 'r3', author: 'Entreprise B.', rating: 5, comment: 'Parfait pour mon stock de boutique.', date: '2024-03-25T09:00:00Z' }
    ]
  },
  {
    id: 'p3',
    name: 'Huile de Coco Vierge - Pur Togo (Litre)',
    description: 'Extraction à froid. 100% naturel sans additifs. Idéal pour la peau et la cuisine.',
    price: 4500,
    category: 'Alimentation',
    image: 'https://images.unsplash.com/photo-1590233064002-da0510196881?auto=format&fit=crop&q=80&w=800',
    sellerId: 's3',
    sellerName: 'Togo Naturel',
    rating: 4.7,
    reviewsCount: 1,
    verifiedSeller: true,
    stock: 150,
    createdAt: '2024-01-15T09:00:00Z',
    sellingType: 'retail',
    reviews: [
      { id: 'r4', author: 'Jean P.', rating: 5, comment: 'L\'odeur est divine et naturelle.', date: '2024-02-10T15:00:00Z' }
    ]
  },
  {
    id: 'p17',
    name: 'Café Robusta Arabica de Kpalimé - 500g',
    description: 'Torréfaction artisanale dans les montagnes du Togo. Un goût riche et puissant.',
    price: 3800,
    category: 'Alimentation',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800',
    sellerId: 's2',
    sellerName: 'Artisans du Grand Kloto',
    rating: 4.9,
    reviewsCount: 1,
    verifiedSeller: true,
    stock: 200,
    createdAt: '2024-03-22T11:00:00Z',
    sellingType: 'retail',
    reviews: [
      { id: 'r5', author: 'Mélissa K.', rating: 5, comment: 'Le meilleur café du Togo.', date: '2024-03-28T08:00:00Z' }
    ]
  },
  {
    id: 'p18',
    name: 'Poterie Traditionnelle de Bolou',
    description: 'Jarres artisanales pour conserver l\'eau au frais naturellement. Fait main.',
    price: 8500,
    category: 'Artisanat',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800',
    sellerId: 's14',
    sellerName: 'Potiers du Zio',
    rating: 4.6,
    reviewsCount: 0,
    verifiedSeller: false,
    stock: 10,
    createdAt: '2023-11-12T16:00:00Z',
    sellingType: 'retail',
    reviews: []
  },
  {
    id: 'p19',
    name: 'Savon Noir Artisanal (Dudu-Osun Style)',
    description: 'Aux herbes naturelles et beurre de karité. Pour une peau éclatante.',
    price: 1500,
    category: 'Beauté & Soins',
    image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=800',
    sellerId: 's5',
    sellerName: 'Coopérative Tchaoudjo',
    rating: 4.8,
    reviewsCount: 1,
    verifiedSeller: true,
    stock: 500,
    createdAt: '2024-02-01T08:00:00Z',
    sellingType: 'retail',
    reviews: [
      { id: 'r6', author: 'Afiwa L.', rating: 5, comment: 'Efficace contre les imperfections.', date: '2024-02-15T11:00:00Z' }
    ]
  },
  {
    id: 'p20',
    name: 'Graines de Soja Bio - 50kg (Exportation)',
    description: 'Certifié biologique. Prêt pour l\'exportation. Gros volumes disponibles.',
    price: 25000,
    category: 'B2B / Gros',
    image: 'https://images.unsplash.com/photo-1599590984817-009696766699?auto=format&fit=crop&q=80&w=800',
    sellerId: 's15',
    sellerName: 'Centrale d\'Achat Agro',
    rating: 4.5,
    reviewsCount: 0,
    verifiedSeller: true,
    stock: 1000,
    createdAt: '2024-03-21T10:00:00Z',
    sellingType: 'wholesale',
    minOrderQuantity: 50,
    reviews: []
  },
  {
    id: 'p4',
    name: 'Smartphone Pro Z-24 (Édition Africa)',
    description: 'Écran 6.7 pouces, Batterie 6000mAh, Caméra 108MP. Conçu pour durer.',
    price: 145000,
    category: 'Électronique',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
    sellerId: 's4',
    sellerName: 'Lomé Tech Hub',
    rating: 4.5,
    reviewsCount: 1,
    verifiedSeller: false,
    isSponsored: true,
    stock: 3,
    createdAt: '2024-03-10T15:00:00Z',
    sellingType: 'retail',
    reviews: [
      { id: 'r7', author: 'Techie Togolais', rating: 4, comment: 'Bonne autonomie.', date: '2024-03-15T10:00:00Z' }
    ]
  },
  {
    id: 'p21',
    name: 'Chaussures Sandales en Cuir - Marque TOGO',
    description: 'Cuir véritable, tannage végétal. Très résistantes et élégantes.',
    price: 18000,
    category: 'Mode & Textile',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800',
    sellerId: 's16',
    sellerName: 'Atelier de la Marina',
    rating: 4.7,
    reviewsCount: 0,
    verifiedSeller: true,
    stock: 25,
    createdAt: '2024-02-28T12:00:00Z',
    sellingType: 'retail',
    variants: [
      { id: 'v3', color: 'Marron', size: '42', stock: 10 },
      { id: 'v4', color: 'Noir', size: '44', stock: 15 }
    ],
    reviews: []
  }
];
