export interface TeamMemberProps {
    imageUrl: string;
    name: string;
    role: string;
}

export function createTeamCard({
                                   imageUrl,
                                   name,
                                   role,
                               }: TeamMemberProps): HTMLElement {
    const card = document.createElement('article');
    card.className = 'team-card';

    card.innerHTML = `
    <div class="team-card__image">
      <img src="${imageUrl}" alt="${name}">
    </div>
    <h3 class="team-card__name">${name}</h3>
    <p class="team-card__role">${role}</p>
  `;

    return card;
}