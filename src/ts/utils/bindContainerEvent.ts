import {fetchProductById} from "../services/productService.js";
import type {Product} from "../types/product";

declare global {
    interface Window {
        cartStorage?: {
            addToCart: (product: Product, quantity?: number) => void;
        };
    }
}

export function bindProductGridEvents(container: HTMLElement | null): void {
    if (!container) return;

    const detailsPath = window.location.pathname.includes('/src/html/')
        ? 'product-details.html'
        : './html/product-details.html';

    container.addEventListener('click', async (event: MouseEvent) => {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const card = target.closest<HTMLElement>('.product-card');
        if (!card || !container.contains(card)) return;

        const productId = card.getAttribute('data-product-id');
        if (!productId) return;

        // 1. Clicked on the Add To Cart button
        const addBtn = target.closest('.product-card__btn, .btn, button');
        if (addBtn) {
            event.stopPropagation();
            const product = await fetchProductById(productId);
            if (product) {
                window.cartStorage?.addToCart(product, 1);
            }
            return;
        }

        // 2. Clicked anywhere else on the card -> navigate to Product Details
        window.location.href = `${detailsPath}?id=${encodeURIComponent(productId)}`;
    });
}