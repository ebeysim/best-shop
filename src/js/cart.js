import { fetchProducts } from "./services/productService.js";
import { getStorageItem, setStorageItem } from "./utils/storage.js";
import {createPageHero} from "./components/heroSection.js";

const CART_STORAGE_KEY = "cart";
const DISCOUNT_STORAGE_KEY = "cartDiscount";
const SHIPPING_COST = 30;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function getCartItems() {
  const items = window.cartStorage?.getCart?.() ?? getStorageItem(CART_STORAGE_KEY, []);
  return Array.isArray(items)
    ? items.filter((item) => item && typeof item === "object" && item.id)
    : [];
}

function saveCartItems(items) {
  if (window.cartStorage?.saveCart) {
    window.cartStorage.saveCart(items);
    return;
  }

  setStorageItem(CART_STORAGE_KEY, items);
  window.dispatchEvent(new CustomEvent("cart:updated"));
}

function getDiscountPercent() {
  const value = getStorageItem(DISCOUNT_STORAGE_KEY, null);
  if (typeof value !== "number" && typeof value !== "string") return 0;

  const percentage = Number(value);
  return Number.isFinite(percentage) && percentage > 0 && percentage <= 100
    ? percentage
    : 0;
}

function createCell(className, label, content) {
  const cell = document.createElement("td");
  cell.className = className;
  cell.dataset.label = label;
  cell.append(content);
  return cell;
}

function createQuantityControl(quantity) {
  const control = document.createElement("div");
  control.className = "cart-qty";

  const decrease = document.createElement("button");
  decrease.className = "cart-qty__btn";
  decrease.type = "button";
  decrease.dataset.action = "decrease";
  decrease.setAttribute("aria-label", "Decrease quantity");
  decrease.textContent = "-";

  const value = document.createElement("span");
  value.className = "cart-qty__value";
  value.textContent = String(quantity);

  const increase = document.createElement("button");
  increase.className = "cart-qty__btn";
  increase.type = "button";
  increase.dataset.action = "increase";
  increase.setAttribute("aria-label", "Increase quantity");
  increase.textContent = "+";

  control.append(decrease, value, increase);
  return control;
}

function createRemoveButton(name) {
  const button = document.createElement("button");
  button.className = "cart-table__delete-btn";
  button.type = "button";
  button.dataset.action = "remove";
  button.setAttribute("aria-label", `Remove ${name} from cart`);

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.classList.add("cart-table__delete-icon");
  icon.setAttribute("width", "18");
  icon.setAttribute("height", "18");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "2");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.setAttribute("aria-hidden", "true");

  const top = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  top.setAttribute("points", "3 6 5 6 21 6");
  const bin = document.createElementNS("http://www.w3.org/2000/svg", "path");
  bin.setAttribute("d", "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6");
  const lines = document.createElementNS("http://www.w3.org/2000/svg", "path");
  lines.setAttribute("d", "M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2");
  icon.append(top, bin, lines);
  button.append(icon);
  return button;
}

function createCartRow(item, index) {
  const row = document.createElement("tr");
  row.className = "cart-table__row";
  row.dataset.cartIndex = String(index);

  const image = document.createElement("img");
  image.className = "cart-table__image";
  image.src = `../${item.imageUrl}`;
  image.alt = item.name;
  image.loading = "lazy";
  row.append(createCell("cart-table__td cart-table__td--image", "IMAGE", image));

  const name = document.createElement("span");
  name.className = "cart-table__name";
  name.textContent = item.name;
  if (item.size || item.color) {
    const variant = document.createElement("span");
    variant.className = "cart-table__variant";
    variant.textContent = [item.size, item.color].filter(Boolean).join(" / ");
    const nameContent = document.createElement("span");
    nameContent.append(name, variant);
    row.append(createCell("cart-table__td cart-table__td--name", "PRODUCT NAME", nameContent));
  } else {
    row.append(createCell("cart-table__td cart-table__td--name", "PRODUCT NAME", name));
  }

  const price = document.createElement("span");
  price.textContent = currency.format(item.price);
  row.append(createCell("cart-table__td cart-table__td--price", "PRICE", price));
  row.append(createCell(
    "cart-table__td cart-table__td--quantity",
    "QUANTITY",
    createQuantityControl(item.quantity)
  ));

  const total = document.createElement("span");
  total.textContent = currency.format(item.price * item.quantity);
  row.append(createCell("cart-table__td cart-table__td--total", "TOTAL", total));
  row.append(createCell(
    "cart-table__td cart-table__td--delete",
    "DELETE",
    createRemoveButton(item.name)
  ));
  return row;
}

function renderDiscountRow(summary, percent, discountAmount) {
  const existingRow = summary.querySelector(".cart-summary__row--discount");
  if (percent <= 0 || discountAmount <= 0) {
    existingRow?.remove();
    return;
  }

  const row = existingRow ?? document.createElement("div");
  row.className = "cart-summary__row cart-summary__row--discount";
  row.replaceChildren();

  const label = document.createElement("span");
  label.className = "cart-summary__label";
  label.textContent = `Discount (${percent}%)`;
  const value = document.createElement("span");
  value.className = "cart-summary__value";
  value.textContent = `-${currency.format(discountAmount)}`;
  row.append(label, value);

  const totalRow = summary.querySelector(".cart-summary__row--total");
  if (totalRow) summary.insertBefore(row, totalRow);
  else summary.append(row);
}

function showFeedback(message) {
  const feedback = document.getElementById("cartFeedback");
  if (!feedback) return;
  feedback.textContent = message;
  feedback.hidden = false;
}

function renderCart(productsById) {
  const tableBody = document.getElementById("cartTableBody");
  const content = document.getElementById("cartContent");
  const emptyState = document.getElementById("cartEmptyState");
  const summary = document.querySelector(".cart-summary");
  if (!tableBody || !content || !emptyState || !summary) return;

  let itemsChanged = false;
  const cartItems = getCartItems().map((storedItem) => {
    const product = productsById.get(String(storedItem.id));
    const quantity = Number.isInteger(storedItem.quantity) && storedItem.quantity > 0
      ? storedItem.quantity
      : 1;
    const item = {
      id: product?.id ?? storedItem.id,
      name: product?.name ?? storedItem.name,
      price: product?.price ?? storedItem.price,
      imageUrl: product?.imageUrl ?? storedItem.imageUrl,
      size: product?.size ?? storedItem.size,
      color: product?.color ?? storedItem.color,
      quantity,
    };
    if (product && (
      storedItem.id !== item.id ||
      storedItem.name !== item.name ||
      storedItem.price !== item.price ||
      storedItem.imageUrl !== item.imageUrl ||
      storedItem.size !== item.size ||
      storedItem.color !== item.color ||
      storedItem.quantity !== quantity
    )) {
      itemsChanged = true;
    }
    return item;
  });
  if (itemsChanged) saveCartItems(cartItems);

  const hasItems = cartItems.length > 0;
  content.hidden = !hasItems;
  emptyState.hidden = hasItems;
  tableBody.replaceChildren(...cartItems.map(createCartRow));

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountPercent = getDiscountPercent();
  const discountAmount = subtotal * discountPercent / 100;
  const shipping = hasItems ? SHIPPING_COST : 0;

  const subtotalElement = document.getElementById("cartSubTotal");
  const shippingElement = document.getElementById("cartShipping");
  const totalElement = document.getElementById("cartTotal");
  if (subtotalElement) subtotalElement.textContent = currency.format(subtotal);
  if (shippingElement) shippingElement.textContent = currency.format(shipping);
  if (totalElement) {
    totalElement.textContent = currency.format(subtotal - discountAmount + shipping);
  }
  renderDiscountRow(summary, discountPercent, discountAmount);
}

function renderCartHero() {
  const container = document.getElementById('hero-container');
  if (!container) return;

  const heroSection = createPageHero({
    title: "My Cart",
    backgroundImageUrl: "../assets/images/cart/banner image.jpg",
  });
  container.replaceWith(heroSection);
}

async function initCartPage() {
  renderCartHero();
  const { items: products } = await fetchProducts();
  const productsById = new Map(products.map((product) => [String(product.id), product]));

  renderCart(productsById);

  const tableBody = document.getElementById("cartTableBody");
  tableBody?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("button[data-action]");
    const row = button?.closest("tr[data-cart-index]");
    if (!button || !row) return;

    const index = Number(row.dataset.cartIndex);
    const items = getCartItems();
    const item = items[index];
    if (!item) return;

    switch (button.dataset.action) {
      case "increase":
        item.quantity = (Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1) + 1;
        break;
      case "decrease":
        item.quantity = Math.max(1, (Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1) - 1);
        break;
      case "remove":
        items.splice(index, 1);
        break;
      default:
        return;
    }

    saveCartItems(items);
    renderCart(productsById);
  });

  document.getElementById("clearCartBtn")?.addEventListener("click", () => {
    saveCartItems([]);
    renderCart(productsById);
    showFeedback("Shopping cart cleared.");
  });

  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    if (getCartItems().length === 0) return;
    saveCartItems([]);
    renderCart(productsById);
    showFeedback("Thank you for your purchase.");
  });
}

initCartPage();