import { createTravelCard } from './components/travelCard.js';
import { createProductCard } from './components/productCard.js';
import { createOfferCard } from './components/offerCard.js';
import { createCustomerCard } from './components/customerCard.js';
import {fetchProducts} from "./services/productService.js";

export const travelSuitcasesData = [
    {
        imageUrl: 'assets/images/home/suitcase real-live.png',
        altText: 'Classic Real Live Suitcase',
        title: 'Duis vestibulum elit vel neque.',
        description: 'Duis vestibulum vel neque pharetra vulputate. Quisque scelerisque nisi.',
    },
    {
        imageUrl: 'assets/images/home/suitcase real-live-1.png',
        altText: 'Modern Travel Suitcase 1',
        title: 'Aliquam faucibus odionecom.',
        description: 'Curabitur vulputate arcu odio, ac facilisis diam accumsan ut.',
    },
    {
        imageUrl: 'assets/images/home/suitcase real-live-2.png',
        altText: 'Premium Travel Suitcase 2',
        title: 'Donec interdum lectus in.',
        description: 'Nulla eleifend pulvinar purus molestie euismod odio imperdiet ac.',
    },
    {
        imageUrl: 'assets/images/home/suitcase real-live-3.png',
        altText: 'Durable Travel Suitcase 3',
        title: 'Morbi fermentum velitsodales.',
        description: 'Sed ipsum felis tristique egestas et convallis ac velit consequat.',
    },
];

export const offerData = {
    imageUrl: './assets/images/offer of the month image.png',
    altText: '50% Discount Offer',
    discount: '50%',
    discountSubtitle: 'Curabitur vulputate arcu odio, ac facilisis diam.',
    title: 'Offer Of The Month',
    description: 'Curabitur vulputate arcu odio, ac facilisis diam accumsan ut. Ut imperdiet et leo in vulputate.',
    buttonText: 'Get Offer Today',
};

export const gratefulCustomersData = [
    {
        imageUrl: 'assets/images/home/grateful customer 1.png',
        altText: 'Lillian Bennett avatar',
        name: 'Lillian Bennett',
        rating: 5,
        reviewText: 'Duis vestibulum elit vel neque pharetra vulputate. Quisque scelerisque nisi urna.',
    },
    {
        imageUrl: 'assets/images/home/grateful customer 2.png',
        altText: 'Alexander Foster avatar',
        name: 'Alexander Foster',
        rating: 5,
        reviewText: 'Curabitur vulputate arcu odio, ac facilisis diam accumsan ut. Ut imperdiet et leo in vulputate.',
    },
    {
        imageUrl: 'assets/images/home/grateful customer 3.png',
        altText: 'Sophia Davis avatar',
        name: 'Sophia Davis',
        rating: 5,
        reviewText: 'Nulla eleifend pulvinar purus, molestie euismod odio imperdiet ac. Donec interdum lectus in convallis pulvinar.',
    },
];

export function renderTravelSuitcases() {
    const container = document.getElementById('travel-suitcases-container');
    if (!container) {
        return;
    }

    container.innerHTML = '';
    const cards = travelSuitcasesData.map((item) => createTravelCard(item));
    container.append(...cards);
}

export function renderOfferSection() {
    const container = document.getElementById('offer-container');
    if (!container) {
        return;
    }
    container.innerHTML = '';
    const card = createOfferCard(offerData);
    container.appendChild(card);
}

export function renderGratefulCustomers() {
    const container = document.getElementById('grateful-customers-container');
    if (!container) {
        return;
    }

    container.innerHTML = '';
    const cards = gratefulCustomersData.map((item) => createCustomerCard(item));
    container.append(...cards);
}

export function renderSelectedProducts(selectedProducts) {
    const selectedContainer = document.getElementById('selected-products-container');
    if (selectedContainer) {
        selectedContainer.innerHTML = '';
        const cards = selectedProducts.map((item) => createProductCard(item));
        selectedContainer.append(...cards);
    }
}

export function renderNewArrivals(newArrivals) {
    const newArrivalsContainer = document.getElementById('new-arrivals-container');
    if (newArrivalsContainer) {
        newArrivalsContainer.innerHTML = '';
        const cards = newArrivals.map((item) => createProductCard(item));
        newArrivalsContainer.append(...cards);
    }
}

export async function renderProductsCards() {
    const [{ items: newArrivals }, { items: selectedProducts }] = await Promise.all([
        fetchProducts({ block: 'New Products Arrival' }),
        fetchProducts({ block: 'Selected Products' }),
    ]);

    renderNewArrivals(newArrivals);
    renderSelectedProducts(selectedProducts);
}

export function initHomePage() {
    renderTravelSuitcases();
    renderOfferSection();
    renderGratefulCustomers();
    renderProductsCards();
}

initHomePage();
