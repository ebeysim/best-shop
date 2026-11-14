import { createFeatureMiniCard } from './components/miniFeaturesCard.js';
import { createTeamCard } from './components/teamMemberCard.js';
import { createOfferCard } from './components/offerCard.js';
import { createPageHero } from './components/heroSection.js';


export const offerData = {
    imageUrl: '../assets/images/offer of the month image.png',
    altText: '50% Discount Offer',
    discount: '50%',
    discountSubtitle: 'Curabitur vulputate arcu odio, ac facilisis diam.',
    title: 'Offer Of The Month',
    description: 'Curabitur vulputate arcu odio, ac facilisis diam accumsan ut. Ut imperdiet et leo in vulputate.',
    buttonText: 'Get Offer Today',
};

const ABOUT_FEATURES = [
    {
        iconUrl: '../assets/images/about/icon-accuracy.svg',
        title: 'Superior Accuracy',
        description: 'Qewist vestibulum elit vel neque pharetra vulputate scelerisque nisi urna.',
    },
    {
        iconUrl: '../assets/images/about/icon-awards.svg',
        title: 'Awards',
        description: 'Vestibulum elit vel neque pharetra vulputate. Quisque scelerisque nisi urna.',
    },
    {
        iconUrl: '../assets/images/about/icon-ecological.svg',
        title: 'Ecological',
        description: 'Elit vel neque duis vestibulum pharetra vulputateuisque scelerisque nisi urna.',
    },
    {
        iconUrl: '../assets/images/about/icon-shipping.svg',
        title: 'Shipping Worlwide',
        description: 'Quisque scelerisque nisi urna. Duis vestibulum elit vel neque pharetra vulputate.',
    },
];

const TEAM_MEMBERS = [
    {
        imageUrl: '../assets/images/about/Natalia Foster image.png',
        name: 'NATALIIA FOSTER',
        role: 'Product Manager',
    },
    {
        imageUrl: '../assets/images/about/Alexandra Thompson.png',
        name: 'ALEXANDRA THOMPSON',
        role: 'Graphic Designer',
    },
    {
        imageUrl: '../assets/images/about/Iryna Brooks.png',
        name: 'IRYNA BROOKS',
        role: 'Head Of Marketing',
    },
];

export function renderAboutFeatures() {
    const container = document.getElementById('about-features-container');
    if (container) {
        container.innerHTML = '';
        const cards = ABOUT_FEATURES.map((feature) => createFeatureMiniCard(feature));
        container.append(...cards);
    }
}

export function renderAboutHero(){
    const container = document.getElementById('hero-container');
    if (!container) return;

    const hero = createPageHero({
        title: 'About Us',
        subtitle: 'Duis vestibulum elit vel neque pharetra vulputate.<br>Duis rutrum non risus in imperdiet.',
        backgroundImageUrl: '../assets/images/about/banner image.jpg',
    });

    container.replaceWith(hero);
}

export function renderTeamMembers() {
    const container = document.getElementById('team-container');
    if (container) {
        container.innerHTML = '';
        const cards = TEAM_MEMBERS.map((member) => createTeamCard(member));
        container.append(...cards);
    }
}

export function renderOfferSection() {
    const container = document.getElementById('offer-container');
    if (container) {
        container.innerHTML = '';
        container.append(createOfferCard(offerData));
    }
}

export function initAboutPage() {
    renderAboutHero();
    renderAboutFeatures();
    renderTeamMembers();
    renderOfferSection();
}

initAboutPage();