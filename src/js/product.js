import { fetchProducts, fetchProductById } from "./services/productService.js";
import { createProductCard } from "./components/productCard.js";
import formatRatingStars from "./utils/formatRatingStars.js";
import { bindProductGridEvents } from "./utils/bindContainerEvent.js";
import { isValidEmail } from "./utils/validEmail.js";

// Placeholder paths for the 3 static carousel angles & reviewer profile image (swap with your filenames)
const DEFAULT_GALLERY_FALLBACKS = [
    "../assets/images/product/suitcase-small-card-1.png",
    "../assets/images/product/suitcase-small-4.png",
    "../assets/images/product/suitcase-small-2.png",
];
const STATIC_AVATAR_PLACEHOLDER = "../assets/images/placeholder-avatar.png";

const DEFAULT_SHORT_DESCRIPTION = `
  <p>The new suitcase is a bold reimagining of travel essentials, designed to elevate every journey. Made with at least 30% recycled materials, its lightweight yet impact-resistant shell combines eco-conscious innovation with rugged durability.</p>
  <p>The ergonomic handle and GlideMotion spinner wheels ensure effortless mobility while making a statement in sleek design. Inside, the modular compartments and adjustable straps keep your belongings secure and neatly organized, no matter the destination.</p>
`;

let currentProduct = null;
let reviews = [];
let selectedFormRating = 0;

async function initProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    const { items: allProducts } = await fetchProducts();
    if (allProducts.length === 0) return;

    // Fetch product by ?id= or default to the first product if opened directly
    currentProduct = (productId ? await fetchProductById(productId) : undefined) ?? allProducts[0];

    renderProductOverview(currentProduct);
    initImageCarousel(currentProduct);
    initQuantityAndCart(currentProduct);
    initTabs();
    initReviews(currentProduct);
    renderRelatedProducts(allProducts, currentProduct.id);
}

// 1. Render Name, Rating, Price & Short-Circuited Description
function renderProductOverview(product) {
    const titleEl = document.getElementById("product-title");
    const starsEl = document.getElementById("product-rating-stars");
    const priceEl = document.getElementById("product-price");
    const descEl = document.getElementById("product-short-desc");

    if (titleEl) titleEl.textContent = product.name;
    if (starsEl) {
        starsEl.textContent = formatRatingStars(product.rating);
        starsEl.setAttribute("aria-label", `${product.rating} out of 5 stars`);
    }
    if (priceEl) priceEl.textContent = `$${product.price}`;

    // Short-circuit description fallback
    if (descEl) {
        descEl.innerHTML = product.description
            ? `<p>${product.description}</p>`
            : DEFAULT_SHORT_DESCRIPTION;
    }
}

// 2. Image Carousel (Accepts an images array or combines single imageUrl + 3 static placeholders)
function initImageCarousel(product) {
    const mainImg = document.getElementById("product-main-image");
    const thumbsContainer = document.getElementById("product-thumbs");
    if (!mainImg || !thumbsContainer) return;

    const primarySrc = `../${product.imageUrl}`;
    const galleryImages =
        Array.isArray(product.images) && product.images.length > 0
            ? product.images.map((img) => `../${img}`)
            : [primarySrc, ...DEFAULT_GALLERY_FALLBACKS];

    mainImg.src = galleryImages[0];
    mainImg.alt = product.name;

    const galleryLegend = thumbsContainer.querySelector("legend");
    thumbsContainer.innerHTML = galleryImages
        .map(
            (src, index) => `
        <button
          type="button"
          class="product-gallery__thumb-btn ${index === 0 ? "product-gallery__thumb-btn--active" : ""}"
          data-index="${index}"
          aria-label="View image ${index + 1}"
        >
          <img src="${src}" alt="${product.name} view ${index + 1}" />
        </button>
      `
        )
        .join("");
    if (galleryLegend) thumbsContainer.prepend(galleryLegend);

    thumbsContainer.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const btn = target.closest(".product-gallery__thumb-btn");
        if (!btn) return;

        const index = Number(btn.dataset.index);
        if (galleryImages[index]) {
            mainImg.src = galleryImages[index];
            thumbsContainer
                .querySelectorAll(".product-gallery__thumb-btn")
                .forEach((el) => el.classList.remove("product-gallery__thumb-btn--active"));
            btn.classList.add("product-gallery__thumb-btn--active");
        }
    });
}

// 3. Quantity Stepper & Add to Cart
function initQuantityAndCart(product) {
    const minusBtn = document.getElementById("qty-minus");
    const plusBtn = document.getElementById("qty-plus");
    const qtyInput = document.getElementById("qty-input");
    const addBtn = document.getElementById("add-to-cart-btn");

    minusBtn?.addEventListener("click", () => {
        if (!qtyInput) return;
        const current = Math.max(1, Number(qtyInput.value) || 1);
        qtyInput.value = String(Math.max(1, current - 1));
    });

    plusBtn?.addEventListener("click", () => {
        if (!qtyInput) return;
        const current = Math.max(1, Number(qtyInput.value) || 1);
        qtyInput.value = String(current + 1);
    });

    addBtn?.addEventListener("click", () => {
        const qty = Math.max(1, Number(qtyInput?.value) || 1);
        window.cartStorage?.addToCart(product, qty);
    });
}

// 4. Tab Menu Switching (DETAILS / REVIEWS / SHIPPING POLICY)
function initTabs() {
    const tabButtons = document.querySelectorAll(".product-tabs__btn");
    const panels = document.querySelectorAll(".product-tabs__panel");

    tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetTab = btn.dataset.tab;

            tabButtons.forEach((b) => {
                const isActive = b === btn;
                b.classList.toggle("product-tabs__btn--active", isActive);
                b.setAttribute("aria-selected", String(isActive));
            });

            panels.forEach((panel) => {
                panel.hidden = panel.id !== `panel-${targetTab}`;
            });
        });
    });
}

// 5. Reviews Rendering & Form Submission (Fetched Star Rating + Static Profile/Comment)
function initReviews(product) {
    reviews = [
        {
            author: "Ella Harper",
            date: "June 11, 2025",
            rating: product.rating ?? 4,
            comment:
                "Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius eget urna sit amet luctus. Suspendisse potenti curabitur ac placerat est, sit amet sodales risus.",
            avatarUrl: "../assets/images/product/review customer.png",
        },
    ];

    renderReviewsList(product.name);
    bindStarPicker();
    bindReviewForm(product.name);
}

function renderReviewsList(productName) {
    const listEl = document.getElementById("reviews-list");
    const headingEl = document.getElementById("reviews-heading");
    const topCountEl = document.getElementById("product-review-count");

    const countText = `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"} for ${productName}`;
    if (headingEl) headingEl.textContent = countText;
    if (topCountEl) {
        topCountEl.textContent = `(${reviews.length} ${reviews.length === 1 ? "Client Review" : "Clients Review"})`;
    }

    if (!listEl) return;

    const reviewElements = reviews.map((review) => {
        const article = document.createElement("article");
        article.className = "review-item";

        const avatar = document.createElement("img");
        avatar.src = review.avatarUrl;
        avatar.alt = review.author;
        avatar.className = "review-item__avatar";

        const body = document.createElement("div");
        body.className = "review-item__body";

        const header = document.createElement("div");
        header.className = "review-item__header";

        const authorDate = document.createElement("div");
        const author = document.createElement("span");
        author.className = "review-item__author";
        author.textContent = review.author;

        const date = document.createElement("span");
        date.className = "review-item__date";
        date.textContent = `/ ${review.date}`;
        authorDate.append(author, date);

        const stars = document.createElement("span");
        stars.className = "review-item__stars";
        stars.setAttribute("aria-label", `${review.rating} out of 5 stars`);
        stars.textContent = formatRatingStars(review.rating);
        header.append(authorDate, stars);

        const comment = document.createElement("p");
        comment.className = "review-item__comment";
        comment.textContent = review.comment;

        body.append(header, comment);
        article.append(avatar, body);
        return article;
    });

    listEl.replaceChildren(...reviewElements);
}

function bindStarPicker() {
    const picker = document.getElementById("review-star-picker");
    if (!picker) return;

    const starButtons = picker.querySelectorAll("button[data-rating]");

    starButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            selectedFormRating = Number(btn.dataset.rating);
            starButtons.forEach((s) => {
                const val = Number(s.dataset.rating);
                s.textContent = val <= selectedFormRating ? "★" : "☆";
            });
        });
    });
}

function bindReviewForm(productName) {
    const form = document.getElementById("review-form");
    const commentInput = document.getElementById("review-comment");
    const nameInput = document.getElementById("review-name");
    const emailInput = document.getElementById("review-email");
    const statusEl = document.getElementById("review-form-status");
    const errorEl = document.getElementById("review-form-error");

    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!commentInput || !nameInput || !emailInput) return;

        if (statusEl) statusEl.textContent = "";
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.style.display = "none";
        }

        const comment = commentInput.value.trim();
        const author = nameInput.value.trim();
        const email = emailInput.value.trim();
        const emailIsValid = isValidEmail(email);

        if (selectedFormRating === 0 || !comment || !author || !emailIsValid) {
            if (errorEl) {
                errorEl.textContent =
                    "Please select a star rating and fill in your review, name, and a valid email address.";
                errorEl.style.display = "block";
            }
            return;
        }

        const formattedDate = new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });

        reviews.push({
            author,
            date: formattedDate,
            rating: selectedFormRating,
            comment,
            avatarUrl: STATIC_AVATAR_PLACEHOLDER,
        });

        renderReviewsList(productName);

        form.reset();
        selectedFormRating = 0;
        document
            .querySelectorAll("#review-star-picker button")
            .forEach((btn) => (btn.textContent = "☆"));

        if (statusEl) {
            statusEl.textContent = "Thank you! Your review has been added.";
        }
    });
}

// 6. "You May Also Like" (4 Random Products + Delegated Grid Clicks)
function renderRelatedProducts(allProducts, currentId) {
    const grid = document.getElementById("related-products-grid");
    if (!grid) return;

    const relatedItems = allProducts
        .filter((p) => (String(p.id) !== String(currentId) && p.category !== "luggage sets"))
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    grid.innerHTML = "";
    const cards = relatedItems.map(pr => createProductCard({
        ...pr,
        imageUrl: `../${pr.imageUrl}`,
    }));
    grid.append(...cards);
    bindProductGridEvents(grid);
}

initProductDetails();