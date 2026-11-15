export interface PageHeroProps {
    title: string;
    subtitle?: string;
    backgroundImageUrl: string;
}

export function createPageHero({
                                   title,
                                   subtitle,
                                   backgroundImageUrl
                               }: PageHeroProps): HTMLElement {
    const section = document.createElement('div');
    section.className = 'page-hero';

    section.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("${backgroundImageUrl}")`;

    section.innerHTML = `
    <div class="page-hero__content">
      <h1 class="page-hero__title">${title}</h1>
      ${subtitle ? `<p class="page-hero__subtitle">${subtitle}</p>` : ''}
    </div>
  `;

    return section;
}