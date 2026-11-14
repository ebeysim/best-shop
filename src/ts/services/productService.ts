import type {Product, PaginatedProducts, ProductQueryOptions} from '../types/product.js';

interface ProductsResponse {
    data: Product[];
}

const DATA_URL = './assets/data.json';

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

            if (options.search !== undefined && options.search.trim() !== '') {
                const term = options.search.toLowerCase().trim();
                if (!product.name.toLowerCase().includes(term)) {
                    return false;
                }
            }

            return true;
        });

        const total = filtered.length;

        // If limit is provided, slice the results for pagination
        if (options.limit !== undefined && options.limit > 0) {
            const page = Math.max(1, options.page ?? 1);
            const totalPages = Math.max(1, Math.ceil(total / options.limit));
            const startIndex = (page - 1) * options.limit;
            const items = filtered.slice(startIndex, startIndex + options.limit);

            return { items, total, page, totalPages };
        }

        // Without limit, return all matching items on page 1
        return {
            items: filtered,
            total,
            page: 1,
            totalPages: 1,
        };
    } catch (error) {
        console.error('Error loading products:', error);
        return { items: [], total: 0, page: 1, totalPages: 1 };
    }
}

/**
 * Fetches a single product by its ID.
 */
export async function fetchProductById(id: string): Promise<Product | undefined> {
    try {
        const allProducts = await loadAllProducts();
        return allProducts.find((product) => product.id === id);
    } catch (error) {
        console.error(`Error loading product ${id}:`, error);
        return undefined;
    }
}