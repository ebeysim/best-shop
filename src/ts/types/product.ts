export type ProductCategory =
    | 'suitcases'
    | 'carry-ons'
    | 'luggage sets'
    | "kids' luggage"
    | (string & {});

export type ProductBlock =
    | 'Selected Products'
    | 'New Products Arrival'
    | 'You May Also Like'
    | (string & {});

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
}

export interface ProductQueryOptions {
  category?: ProductCategory;
  block?: ProductBlock;
  salesStatus?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}
