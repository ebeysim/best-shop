export interface FeatureMiniCardProps {
    iconUrl: string;
    title: string;
    description: string;
    altText?: string;
}

export function createFeatureMiniCard({
                                          iconUrl,
                                          title,
                                          description,
                                          altText,
                                      }: FeatureMiniCardProps): HTMLElement {
    const card = document.createElement('article');
    card.className = 'feature-mini-card';

    card.innerHTML = `
    <div class="feature-mini-card__icon">
      <img src="${iconUrl}" alt="${altText ?? title}">
    </div>
    <h3 class="feature-mini-card__title">${title}</h3>
    <p class="feature-mini-card__desc">${description}</p>
  `;
    return card;
}