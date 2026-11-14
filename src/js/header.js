import { getStorageItem, setStorageItem } from "./utils/storage.js";
import {isValidEmail} from "./utils/validEmail.js";

const STORAGE_KEY = "cart";

window.cartStorage = {
  getCart() {
    return getStorageItem(STORAGE_KEY) || [];
  },

  saveCart(items) {
    setStorageItem(STORAGE_KEY, items);
    window.dispatchEvent(new CustomEvent("cart:updated"));
  },

  addToCart(product, quantity = 1) {
    if (!product || !product.id) {
      return;
    }

    const cart = this.getCart();
    const existingItem = cart.find((item) => item && item.id === product.id);
    const addQty = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

    if (existingItem) {
      existingItem.quantity =
          (Number.isInteger(existingItem.quantity) ? existingItem.quantity : 0) + addQty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: addQty,
      });
    }

    this.saveCart(cart);
  },

  getItemCount() {
    try {
      const items = this.getCart();
      return items.reduce((count, item) => {
        const quantity = item && item.quantity;
        return Number.isInteger(quantity) && quantity > 0 ? count + quantity : count;
      }, 0);
    } catch {
      return 0;
    }
  },
};

export function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const menuToggle = header.querySelector(".burger-btn");
  const navigation = header.querySelector(".site-nav");
  const cartLink = header.querySelector(".site-header__cart");

  // Inside initHeader() in src/js/header.js:
  const userBtn = header.querySelector(".site-header__user-btn");
  const loginModal = document.getElementById("login-modal");
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const togglePasswordBtn = document.getElementById("toggle-password-btn");

  if (userBtn && loginModal) {
    // Open modal when user icon is clicked
    userBtn.addEventListener("click", () => {
      const savedEmail = getStorageItem("userEmail");
      if (savedEmail && emailInput) {
        emailInput.value = savedEmail;
      }
      loginModal.showModal();
    });

    // Close modal when clicking outside the form on the dark backdrop
    loginModal.addEventListener("click", (event) => {
      if (event.target === loginModal) {
        loginModal.close();
      }
    });
  }

// Eye icon password visibility toggle
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      togglePasswordBtn.setAttribute("aria-pressed", String(isHidden));
      togglePasswordBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
      togglePasswordBtn.classList.toggle("is-visible", isHidden);
    });
  }

// Save only email to localStorage and alert on submit
  if (loginForm && emailInput) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return;

      if(!isValidEmail(email)){
        emailInput.setCustomValidity('Please enter a valid email address.');
        emailInput.reportValidity();
        return;
      }

      setStorageItem("userEmail", email);
      loginModal?.close();
      loginForm.reset();
      if (passwordInput) passwordInput.type = "password";

      alert("You are logged in!");
    });
  }

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

  if (menuToggle && navigation) {
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

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
      }
    });

    window.matchMedia("(min-width: 768px)").addEventListener("change", (event) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    });
  }
}