export interface CustomerCardProps {
  imageUrl: string;
  altText?: string;
  name: string;
  rating: number;
  reviewText: string;
  className?: string;
}

function formatStars(rating: number): string {
  const count = Math.max(1, Math.min(5, Math.round(rating)));
  return '★'.repeat(count) + '☆'.repeat(5 - count);
}

export function createCustomerCard(props: CustomerCardProps): HTMLElement {
  const card = document.createElement('article');
  card.className = props.className ? `customer-card ${props.className}` : 'customer-card';

  const avatar = document.createElement('div');
  avatar.className = 'customer-card__avatar';

  const image = document.createElement('img');
  image.className = 'customer-card__image';
  image.src = props.imageUrl;
  image.alt = props.altText ?? `${props.name} avatar`;
  image.loading = 'lazy';

  avatar.appendChild(image);

  const content = document.createElement('div');
  content.className = 'customer-card__content';

  const rating = document.createElement('div');
  rating.className = 'customer-card__rating';
  rating.setAttribute('aria-label', `${props.rating} stars`);
  rating.textContent = formatStars(props.rating);

  const text = document.createElement('p');
  text.className = 'customer-card__text';
  text.textContent = props.reviewText.startsWith('"') ? props.reviewText : `"${props.reviewText}"`;

  const name = document.createElement('h4');
  name.className = 'customer-card__name';
  name.textContent = props.name;

  content.appendChild(rating);
  content.appendChild(text);
  content.appendChild(name);

  card.appendChild(avatar);
  card.appendChild(content);

  return card;
}
