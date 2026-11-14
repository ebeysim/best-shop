import { fetchProducts } from "./services/productService.js";
import { createProductCard } from "./components/productCard.js";
import formatRatingStars from "./utils/formatRatingStars.js";
import {bindProductGridEvents} from "./utils/bindContainerEvent.js";

const ITEMS_PER_PAGE = 12;

const state = {
    currentItems: [],
    filters: {
        category: undefined,
        color: undefined,
        size: undefined,
        salesOnly: false,
    },
    sortBy: "default",
    currentPage: 1,
};

async function initCatalog() {
    bindFilterEvents();
    bindSortEvent();
    bindGridEvents();
    bindSearchEvent();
    await Promise.all([renderCatalog(), renderTopBestSets()]);
}
function bindGridEvents() {
    const grid = document.getElementById("catalog-grid");
    if (!grid) return;

    bindProductGridEvents(grid);
}

// 1. Render Grid + "Showing X–Y of Z Results" + Pagination
async function renderCatalog() {
    const grid = document.getElementById("catalog-grid");
    const countEl = document.getElementById("results-count");
    if (!grid || !countEl) return;

    const { items, total, page, totalPages } = await fetchProducts({
        category: state.filters.category,
        color: state.filters.color,
        size: state.filters.size,
        salesStatus: state.filters.salesOnly ? true : undefined,
        sortBy: state.sortBy,
        page: state.currentPage,
        limit: ITEMS_PER_PAGE,
    });

    state.currentItems = items;
    state.currentPage = page;

    const from = total === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
    const to = (page - 1) * ITEMS_PER_PAGE + items.length;
    countEl.textContent = `Showing ${from}–${to} of ${total} Results`;

    grid.innerHTML = "";
    if (items.length === 0) {
        grid.innerHTML = `<p class="catalog-grid__empty">No products match the selected filters.</p>`;
    } else {
        items.forEach((product) => {
            const card = createProductCard({
                ...product,
                imageUrl: `../${product.imageUrl}`,
            });
            grid.appendChild(card);
        });
    }

    renderPagination(totalPages);
}

// 2. Async Pagination Controls
function renderPagination(totalPages) {
    const container = document.getElementById("catalog-pagination");
    if (!container) return;

    if (totalPages <= 1) {
        container.innerHTML = "";
        return;
    }

    let html = `
    <button type="button" class="catalog-pagination__nav" data-page="${state.currentPage - 1}" ${
        state.currentPage === 1 ? "disabled" : ""
    }>PREV</button>
  `;

    for (let page = 1; page <= totalPages; page++) {
        html += `
      <button type="button" class="catalog-pagination__page ${
            page === state.currentPage ? "catalog-pagination__page--active" : ""
        }" data-page="${page}">${page}</button>
    `;
    }

    html += `
    <button type="button" class="catalog-pagination__nav" data-page="${state.currentPage + 1}" ${
        state.currentPage === totalPages ? "disabled" : ""
    }>NEXT &gt;</button>
  `;

    container.innerHTML = html;

    container.querySelectorAll("button[data-page]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetPage = Number(btn.dataset.page);
            if (targetPage >= 1 && targetPage <= totalPages && targetPage !== state.currentPage) {
                state.currentPage = targetPage;
                renderCatalog();
                document.querySelector(".catalog-main")?.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

// 3. Filter Dropdowns + Highlighting + Reset
function bindFilterEvents() {
    const topBar = document.querySelector(".catalog-filters__top-bar");
    const openBtn = document.getElementById("open-filters-btn");
    const hideBtn = document.getElementById("hide-filters-btn");
    const clearBtn = document.getElementById("clear-filters-btn");
    const panel = document.getElementById("catalog-filters-panel");
    const salesCheckbox = document.getElementById("filter-sales-checkbox");

    // Open / Hide Filter Panel
    openBtn?.addEventListener("click", () => {
        if (!panel || !topBar) return;
        panel.hidden = false;
        topBar.hidden = true;
        openBtn.setAttribute("aria-expanded", "true");
    });

    hideBtn?.addEventListener("click", () => {
        if (!panel || !topBar || !openBtn) return;
        panel.hidden = true;
        topBar.hidden = false;
        openBtn.setAttribute("aria-expanded", "false");
    });

    // Hover Dropdown Options (Size, Color, Category)
    document.querySelectorAll(".filter-dropdown").forEach((dropdown) => {
        const filterKey = dropdown.dataset.filter;
        const trigger = dropdown.querySelector(".filter-dropdown__trigger");
        const valueLabel = dropdown.querySelector(".filter-dropdown__value");
        const defaultLabel = trigger?.dataset.defaultLabel || "Choose option";
        const options = dropdown.querySelectorAll("button[data-value]");

        options.forEach((optBtn) => {
            optBtn.addEventListener("click", () => {
                const chosenValue = optBtn.dataset.value;
                const isSame = state.filters[filterKey] === chosenValue;

                state.filters[filterKey] = isSame ? undefined : chosenValue;

                options.forEach((b) => b.classList.remove("is-selected"));

                if (!isSame) {
                    optBtn.classList.add("is-selected");
                    trigger?.classList.add("filter-dropdown__trigger--active");
                    if (valueLabel) valueLabel.textContent = optBtn.textContent.trim();
                } else {
                    trigger?.classList.remove("filter-dropdown__trigger--active");
                    if (valueLabel) valueLabel.textContent = defaultLabel;
                }

                state.currentPage = 1;
                renderCatalog();
            });
        });
    });

    // Sales Checkbox
    salesCheckbox?.addEventListener("change", () => {
        state.filters.salesOnly = salesCheckbox.checked;
        state.currentPage = 1;
        renderCatalog();
    });

    // Clear Filters Button
    clearBtn?.addEventListener("click", () => {
        state.filters = {
            category: undefined,
            color: undefined,
            size: undefined,
            salesOnly: false,
        };
        state.sortBy = "default";
        state.currentPage = 1;

        if (salesCheckbox) salesCheckbox.checked = false;

        const sortSelect = document.getElementById("catalog-sort");
        if (sortSelect) sortSelect.value = "default";

        document.querySelectorAll(".filter-dropdown").forEach((dropdown) => {
            const trigger = dropdown.querySelector(".filter-dropdown__trigger");
            const valueLabel = dropdown.querySelector(".filter-dropdown__value");
            const defaultLabel = trigger?.dataset.defaultLabel || "Choose option";

            trigger?.classList.remove("filter-dropdown__trigger--active");
            if (valueLabel) valueLabel.textContent = defaultLabel;
            dropdown.querySelectorAll(".is-selected").forEach((el) => el.classList.remove("is-selected"));
        });

        renderCatalog();
    });
}

// 4. Sorting
function bindSortEvent() {
    document.getElementById("catalog-sort")?.addEventListener("change", (event) => {
        state.sortBy = event.target.value;
        state.currentPage = 1;
        renderCatalog();
    });
}

// 5. Search (Redirects to product-details.html if found, opens modal if not)
function bindSearchEvent() {
    const form = document.getElementById("catalog-search-form");
    const input = document.getElementById("catalog-search-input");
    const modal = document.getElementById("not-found-modal");
    const closeBtn = document.getElementById("close-not-found-btn");

    closeBtn?.addEventListener("click", () => modal?.close());

    form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const query = input?.value.trim();
        if (!query) return;

        const { items } = await fetchProducts({ search: query });

        if (items.length > 0) {
            window.location.href = `product-details.html?id=${encodeURIComponent(items[0].id)}`;
        } else {
            modal?.showModal();
        }
    });
}

// 6. Top Best Sets Sidebar (5 Random "luggage sets")
async function renderTopBestSets() {
    const container = document.getElementById("top-best-sets-list");
    if (!container) return;

    const { items } = await fetchProducts({ category: "luggage sets" });
    const randomSets = [...items].sort(() => Math.random() - 0.5).slice(0, 5);

    container.innerHTML = randomSets
        .map((set) => {
            const stars = formatRatingStars(set.rating);
            return `
        <a href="product-details.html?id=${encodeURIComponent(set.id)}" class="best-set-item">
          <img src="../${set.imageUrl}" alt="${set.name}" class="best-set-item__img" />
          <div>
            <p class="best-set-item__name">${set.name}</p>
            <div class="best-set-item__rating" aria-label="${set.rating} out of 5 stars">${stars}</div>
            <p class="best-set-item__price">$${set.price}</p>
          </div>
        </a>
      `;
        })
        .join("");
}

initCatalog();