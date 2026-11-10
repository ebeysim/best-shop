function formatRatingStars(rating) {
  if (rating === undefined || rating === null || Number.isNaN(rating)) {
    return '★★★★★';
  }
  const clamped = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(clamped);
  const hasHalf = clamped % 1 >= 0.5;
  const halfStar = hasHalf ? '⯪' : '';
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalf ? 1 : 0));
  return '★'.repeat(fullStars) + halfStar + '☆'.repeat(emptyStars);
}

export function createProductCard(props) {
  const card = document.createElement('article');
  card.className = props.className ? `product-card ${props.className}` : 'product-card';
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

  const rating = document.createElement('div');
  rating.className = 'product-card__rating';
  const ratingValue = props.rating ?? 5;
  rating.setAttribute('aria-label', `Rating: ${ratingValue} out of 5 stars`);
  rating.textContent = formatRatingStars(props.rating);

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

  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (typeof props.onAddToCart === 'function') {
      props.onAddToCart(props);
    } else if (typeof window !== 'undefined' && window.cartStorage?.addToCart) {
      window.cartStorage.addToCart(props, 1);
    }
  });

  const handleCardNavigation = () => {
    if (typeof props.onCardClick === 'function') {
      props.onCardClick(props.id);
    } else {
      window.location.href = `html/product-details.html?id=${encodeURIComponent(props.id)}`;
    }
  };

  card.addEventListener('click', handleCardNavigation);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardNavigation();
    }
  });

  footer.appendChild(price);
  footer.appendChild(btn);

  body.appendChild(title);
  body.appendChild(rating);
  body.appendChild(footer);

  card.appendChild(media);
  card.appendChild(body);

  return card;
}
