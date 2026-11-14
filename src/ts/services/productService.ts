import type { Product, PaginatedProducts, ProductQueryOptions } from '../types/product.js';

interface ProductsResponse {
    data: Product[];
}

const DATA_URL = window.location.pathname.includes('/src/html/')
    ? '../assets/data.json'
    : './assets/data.json';

let cachedProducts: Product[] | null = null;

async function loadAllProducts(): Promise<Product[]> {
    if (cachedProducts !== null) {
        return cachedProducts;
    }

    const response = await fetch(DATA_URL);

    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const json: unknown = await response.json();

    if (Array.isArray(json)) {
        cachedProducts = json as Product[];
        return cachedProducts;
    }

    if (
        typeof json === 'object' &&
        json !== null &&
        'data' in json &&
        Array.isArray((json as ProductsResponse).data)
    ) {
        cachedProducts = (json as ProductsResponse).data;
        return cachedProducts;
    }

    throw new Error('Invalid products JSON structure');
}

export async function fetchProducts(
    options: ProductQueryOptions = {}
): Promise<PaginatedProducts> {
    try {
        const allProducts = await loadAllProducts();

        const filtered = allProducts.filter((product) => {
            if (options.salesStatus !== undefined && product.salesStatus !== options.salesStatus) {
                return false;
            }

            if (options.block !== undefined && !product.blocks.includes(options.block)) {
                return false;
            }

            if (options.category !== undefined && product.category !== options.category) {
                return false;
            }

            if (options.color !== undefined && product.color !== options.color) {
                return false;
            }

            if (options.size !== undefined && product.size !== options.size) {
                return false;
            }

            if (options.search !== undefined && String(options?.search).trim() !== '') {
                const searchTerm = String(options?.search || "").trim().toLowerCase();
                if (!product.name.toLowerCase().includes(searchTerm)) {
                    return false;
                }
            }

            return true;
        });

        // Apply sorting before pagination slicing
        const sorted = [...filtered];
        switch (options.sortBy) {
            case 'price-asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'popularity':
                sorted.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
                break;
            case 'rating':
                sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
                break;
        }

        const total = sorted.length;

        if (options.limit !== undefined && options.limit > 0) {
            const totalPages = Math.max(1, Math.ceil(total / options.limit));
            const page = Math.min(Math.max(1, options.page ?? 1), totalPages);
            const startIndex = (page - 1) * options.limit;
            const items = sorted.slice(startIndex, startIndex + options.limit);

            return { items, total, page, totalPages };
        }

        return {
            items: sorted,
            total,
            page: 1,
            totalPages: 1,
        };
    } catch (error) {
        console.error('Error loading products:', error);
        return { items: [], total: 0, page: 1, totalPages: 1 };
    }
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
    try {
        const allProducts = await loadAllProducts();
        return allProducts.find((product) => product.id === id);
    } catch (error) {
        console.error(`Error loading product ${id}:`, error);
        return undefined;
    }
}