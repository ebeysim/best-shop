export function createTravelCard(props) {
  const card = document.createElement('article');
  card.className = props.className ? `travel-card ${props.className}` : 'travel-card';

  const media = document.createElement('div');
  media.className = 'travel-card__media';

  const image = document.createElement('img');
  image.className = 'travel-card__image';
  image.src = props.imageUrl;
  image.alt = props.altText ?? '';
  image.loading = 'lazy';

  const overlay = document.createElement('div');
  overlay.className = 'travel-card__overlay';
  overlay.setAttribute('aria-hidden', 'true');

  media.appendChild(image);
  media.appendChild(overlay);

  const content = document.createElement('div');
  content.className = 'travel-card__content';

  const title = document.createElement('h3');
  title.className = 'travel-card__title';
  title.textContent = props.title;

  const description = document.createElement('p');
  description.className = 'travel-card__description';
  description.textContent = props.description;

  content.appendChild(title);
  content.appendChild(description);

  card.appendChild(media);
  card.appendChild(content);

  return card;
}
