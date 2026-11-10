(function (window) {
  'use strict';

  const STORAGE_KEY = 'cart';

  window.cartStorage = {
    getCart() {
      try {
        const storedCart = window.localStorage.getItem(STORAGE_KEY);
        if (!storedCart) {
          return [];
        }
        const items = JSON.parse(storedCart);
        return Array.isArray(items) ? items : [];
      } catch {
        return [];
      }
    },

    saveCart(items) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        window.dispatchEvent(new CustomEvent('cart:updated'));
      } catch {
        // Handle storage quota or error gracefully
      }
    },

    addToCart(product, quantity = 1) {
      if (!product || !product.id) {
        return;
      }

      const cart = this.getCart();
      const existingItem = cart.find((item) => item && item.id === product.id);
      const addQty = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

      if (existingItem) {
        existingItem.quantity = (Number.isInteger(existingItem.quantity) ? existingItem.quantity : 0) + addQty;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: addQty
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
    }
  };
})(window);