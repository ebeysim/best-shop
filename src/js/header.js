const header = document.querySelector(".site-header");
const menuToggle = header?.querySelector(".burger-btn");
const navigation = header?.querySelector(".site-nav");
const cartLink = header?.querySelector(".site-header__cart");

if (cartLink) {
  const syncCartCount = () => {
    let itemCount = 0;

    try {
      const storedCount = window.cartStorage?.getItemCount();

      if (Number.isSafeInteger(storedCount) && storedCount > 0) {
        itemCount = storedCount;
      }
    } catch {
      itemCount = 0;
    }

    cartLink.setAttribute("data-cart-count", String(itemCount));
    cartLink.setAttribute(
      "aria-label",
      `Shopping Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
    );
  };

  syncCartCount();

  window.addEventListener("pageshow", syncCartCount);
  window.addEventListener("storage", (event) => {
    if (event.key === "cart" || event.key === null) {
      syncCartCount();
    }
  });
  window.addEventListener("cart:updated", syncCartCount);
}

if (header && menuToggle && navigation) {
  const setMenuOpen = (isOpen) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    navigation.classList.toggle("is-open", isOpen);
  };

  header.classList.add("site-header-enhanced");

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    setMenuOpen(isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  window.matchMedia("(min-width: 768px)").addEventListener("change", (event) => {
    if (event.matches) {
      setMenuOpen(false);
    }
  });
}