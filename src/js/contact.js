import {createPageHero} from "./components/heroSection.js";
import { createFeatureMiniCard } from './components/miniFeaturesCard.js';
import { isValidEmail } from './utils/validEmail.js';

const CONTACT_INFO_CARDS = [
    {
        iconUrl: '../assets/images/contact/icon-location.svg',
        title: 'Our Location',
        description: '1234 NW Bobcat Lane, St.<br>Robert, MO 65584-5678',
    },
    {
        iconUrl: '../assets/images/contact/icon-time.svg',
        title: 'Operating Time',
        description: 'Monday - Friday: 9am - 6 pm<br>Weekends: 10:30 am - 6pm',
    },
    {
        iconUrl: '../assets/images/contact/icon-email.svg',
        title: 'Our Email',
        description: 'best@shop.com<br>info@bestshop.com',
    },
    {
        iconUrl: '../assets/images/contact/icon-phone.svg',
        title: 'Call Us',
        description: '(268)142-8413<br>(760)265-2917',
    },
];

export function renderContactInfoCards() {
    const container = document.getElementById('contact-info-container');
    if (container) {
        container.innerHTML = '';
        const cards = CONTACT_INFO_CARDS.map((item) => createFeatureMiniCard(item));
        container.append(...cards);
    }
}

export function initContactForm() {
    const form = document.getElementById('contact-form');
    const emailInput = document.getElementById('contact-email');
    const emailError = document.getElementById('contact-email-error');
    if (!form || !emailInput || !emailError) return;

    function checkEmailField() {
        const value = emailInput.value.trim();

        if (value === '') {
            emailInput.classList.remove('form__input--invalid');
            emailError.textContent = '';
            emailInput.setCustomValidity('');
            return false;
        }

        if (!isValidEmail(value)) {
            emailInput.classList.add('form__input--invalid');
            emailError.textContent = 'Please enter a valid email address.';
            emailInput.setCustomValidity('Please enter a valid email address.');
            return false;
        }

        emailInput.classList.remove('form__input--invalid');
        emailError.textContent = '';
        emailInput.setCustomValidity('');
        return true;
    }

    // Real-time validation on every keystroke and blur
    emailInput.addEventListener('input', checkEmailField);

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const isEmailValid = checkEmailField();

        if (!form.checkValidity() || !isEmailValid) {
            emailInput.focus();
            form.reportValidity();
            return;
        }

        form.reset();
        emailInput.classList.remove('form__input--invalid');
        emailError.textContent = '';
    });
}

export function renderContactHero(){
    const container = document.getElementById('hero-container');
    if (!container) return;

    const hero = createPageHero({
        title: 'Contact Us',
        subtitle: 'Duis vestibulum elit vel neque pharetra vulputate.<br>Duis rutrum non risus in imperdiet.',
        backgroundImageUrl: '../assets/images/contact/banner image.jpg',
    });

    container.replaceWith(hero);
}

export function initContactPage(){
    initContactForm();
    renderContactInfoCards();
    renderContactHero();

}

initContactPage();