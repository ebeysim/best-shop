export type ProductCategory =
    | 'suitcases'
    | 'carry-ons'
    | 'luggage sets'
    | "kids' luggage";

export type ProductBlock =
    | 'Selected Products'
    | 'New Products Arrival'
    | 'You May Also Like';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: ProductCategory;
  color: string;
  size: string;
  salesStatus: boolean;
  rating: number;
  popularity: number;
  blocks: ProductBlock[];
  description?: string;
  images?: string[];
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'popularity' | 'rating';

export interface ProductQueryOptions {
  salesStatus?: boolean;
  block?: ProductBlock;
  category?: string;
  color?: string;
  size?: string;
  search?: string;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}
