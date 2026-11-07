(function (window) {
  'use strict';

  const STORAGE_KEY = 'cart';

  window.cartStorage = {
    getItemCount() {
      try {
        const storedCart = window.localStorage.getItem(STORAGE_KEY);
        const items = JSON.parse(storedCart);

        if (!Array.isArray(items)) {
          return 0;
        }

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