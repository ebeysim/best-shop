import type { Product } from "../types/product";

export interface ProductCardProps extends Pick<Product, 'id' | 'name' | 'imageUrl' | "price" | "salesStatus"> {
  altText?: string;
}



export function createProductCard(props: ProductCardProps): HTMLElement {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('data-product-id', props.id);
  card.setAttribute('tabindex', '0');

  const media = document.createElement('div');
  media.className = 'product-card__media';

  const image = document.createElement('img');
  image.className = 'product-card__image';
  image.src = props.imageUrl;
  image.alt = props.altText ?? props.name;
  image.loading = 'lazy';

  media.appendChild(image);

  const body = document.createElement('div');
  body.className = 'product-card__body';

  const title = document.createElement('h3');
  title.className = 'product-card__title';
  title.textContent = props.name;

  const footer = document.createElement('div');
  footer.className = 'product-card__footer';

  const price = document.createElement('span');
  price.className = 'product-card__price';
  price.textContent = `$${Number(props.price).toFixed(2)}`;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn--sm';
  btn.setAttribute('aria-label', 'Save to cart');
  btn.textContent = 'Save to Cart';

  btn.addEventListener('click', (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const globalWindow = window as Window & {
      cartStorage?: {
        addToCart: (product: ProductCardProps, quantity?: number) => void;
      };
    };
    globalWindow.cartStorage?.addToCart(props, 1);
  });

  const handleCardNavigation = () => {
    window.location.href = `html/product-details.html?id=${encodeURIComponent(props.id)}`;
  };

  card.addEventListener('click', handleCardNavigation);
  card.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardNavigation();
    }
  });

  footer.appendChild(price);
  footer.appendChild(btn);

  body.appendChild(title);
  body.appendChild(footer);

  card.appendChild(media);
  card.appendChild(body);

  return card;
}
