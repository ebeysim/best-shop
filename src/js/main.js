import { createHeader } from './components/header.js';
import { createFooter } from './components/footer.js';
import { initHeader } from './header.js';

function initLayout() {
    const path = window.location.pathname;
    const isRoot = !path.includes('/html/');

    let activePage = 'home';
    if (path.includes('catalog')) activePage = 'catalog';
    else if (path.includes('about')) activePage = 'about';
    else if (path.includes('contact')) activePage = 'contact';
    else if (path.includes('product')) activePage = 'product';
    else if (path.includes('cart')) activePage = 'cart';

    const headerRoot = document.getElementById('header-root');
    if (headerRoot) {
        headerRoot.outerHTML = createHeader({ activePage, isRoot });
        initHeader();
    }

    const footerRoot = document.getElementById('footer-root');
    if (footerRoot) {
        footerRoot.outerHTML = createFooter({ isRoot });
    }
}

initLayout();
