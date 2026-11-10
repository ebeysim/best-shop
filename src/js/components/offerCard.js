export function createOfferCard(props) {
  const card = document.createElement('article');
  card.className = props.className ? `offer-card ${props.className}` : 'offer-card';

  const media = document.createElement('div');
  media.className = 'offer-card__media';

  const image = document.createElement('img');
  image.className = 'offer-card__image';
  image.src = props.imageUrl;
  image.alt = props.altText ?? props.title;
  image.loading = 'lazy';

  const overlay = document.createElement('div');
  overlay.className = 'offer-card__overlay';
  overlay.setAttribute('aria-hidden', 'true');

  media.appendChild(image);
  media.appendChild(overlay);

  const content = document.createElement('div');
  content.className = 'offer-card__content';

  const left = document.createElement('div');
  left.className = 'offer-card__left';

  const discount = document.createElement('span');
  discount.className = 'offer-card__discount';
  discount.textContent = props.discount;
  left.appendChild(discount);

  if (props.discountSubtitle) {
    const discountDesc = document.createElement('p');
    discountDesc.className = 'offer-card__discount-desc';
    discountDesc.textContent = props.discountSubtitle;
    left.appendChild(discountDesc);
  }

  const right = document.createElement('div');
  right.className = 'offer-card__right';

  const title = document.createElement('h3');
  title.className = 'offer-card__title';
  title.textContent = props.title;

  const description = document.createElement('p');
  description.className = 'offer-card__description';
  description.textContent = props.description;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn';
  button.textContent = props.buttonText;

  right.appendChild(title);
  right.appendChild(description);
  right.appendChild(button);

  content.appendChild(left);
  content.appendChild(right);

  card.appendChild(media);
  card.appendChild(content);

  return card;
}
