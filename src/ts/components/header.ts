export type PageName = 'home' | 'catalog' | 'about' | 'contact';

export interface HeaderProps {
    activePage: PageName;
    isRoot?: boolean; // true for index.html, false (default) for pages inside html/
}

export function createHeader({ activePage, isRoot = false }: HeaderProps): string {
    const rootPrefix = isRoot ? '' : '../';
    const htmlPrefix = isRoot ? 'html/' : '';

    const navItems: { id: PageName; label: string; href: string }[] = [
        { id: 'home', label: 'Home', href: `${rootPrefix}index.html` },
        { id: 'catalog', label: 'Catalog ▾', href: `${htmlPrefix}catalog.html` },
        { id: 'about', label: 'About Us', href: `${htmlPrefix}about.html` },
        { id: 'contact', label: 'Contact Us', href: `${htmlPrefix}contact.html` },
    ];

    const navLinks = navItems
        .map(
            (item) => `
        <li class="site-nav__item">
          <a 
            href="${item.href}" 
            class="site-nav__link ${activePage === item.id ? 'site-nav__link--active' : ''}"
            ${activePage === item.id ? 'aria-current="page"' : ''}
          >
            ${item.label}
          </a>
        </li>
      `
        )
        .join('');

    return `
    <header class="site-header" id="header-root">
      <!-- Top Utility Bar: Socials, Logo, User & Cart -->
      <div class="site-header__top">
        <div class="site-header__socials">
          <a href="#" aria-label="Facebook"><img src="${rootPrefix}assets/images/facebook.png" alt="Link to Facebook page"></a>
          <a href="#" aria-label="Twitter"><img src="${rootPrefix}assets/images/twitter.png" alt="Link to Twitter page"></a>
          <a href="#" aria-label="Instagram"><img src="${rootPrefix}assets/images/instagram.png" alt="Link to Instagram page"></a>
        </div>

        <a href="${rootPrefix}index.html" class="site-header__logo">
          <img src="${rootPrefix}assets/images/logo.png" alt="">
          <span>BEST SHOP</span>
        </a>

        <div class="site-header__actions">
          <button type="button" class="site-header__user-btn" aria-label="My Account"><img src="${rootPrefix}assets/images/user.png" alt="Login"></button>
          <a class="site-header__cart" data-cart-count="0" aria-label="Shopping Cart, 0 items" href="${htmlPrefix}cart.html">
            <img src="${rootPrefix}assets/images/cart.png" alt="" />
          </a>

          <button class="burger-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
      </div>

      <!-- Divider Line -->
      <hr class="site-header__divider" />

      <!-- Main Navigation Links -->
      <nav class="site-nav" id="main-nav" aria-label="Main Navigation">
        <ul class="site-nav__list">
          ${navLinks}
        </ul>
      </nav>
    </header>
    
 <dialog class="login-modal" id="login-modal" aria-labelledby="login-modal-title">
  <form class="form login-modal__form" id="login-form">
    <h2 id="login-modal-title" class="visually-hidden">Account Login</h2>

    <div class="form__group">
      <label class="form__label" for="login-email">
        Email address <span class="form__required">*</span>
      </label>
      <input
        type="email"
        id="login-email"
        name="email"
        class="form__input"
        required
      />
    </div>

    <div class="form__group">
      <label class="form__label" for="login-password">
        Password <span class="form__required">*</span>
      </label>
      <div class="form__password-wrap">
        <input
          type="password"
          id="login-password"
          name="password"
          class="form__input form__input--password"
          required
        />
        <button
          type="button"
          class="form__eye-btn"
          id="toggle-password-btn"
          aria-label="Show password"
          aria-pressed="false"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
    </div>

    <div class="login-modal__options">
      <label class="login-modal__remember">
        <input type="checkbox" id="login-remember" name="remember" />
        <span>Remember me</span>
      </label>

      <a href="#" class="login-modal__forgot">Forgot Your Password?</a>
    </div>

    <button type="submit" class="btn btn--primary form__submit login-modal__submit">
      LOG IN
    </button>
  </form>
</dialog>
  `;
}