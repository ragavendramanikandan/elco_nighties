// store-app.js - Suneeta Elco Nighties Full Store & Admin Engine

// State Management
let storeState = {
  products: [],
  cart: [],
  wishlist: [],
  coupons: [],
  orders: [],
  activeCurrency: "INR",
  currencyRates: {
    INR: { symbol: "₹", rate: 1 },
    USD: { symbol: "$", rate: 0.012 },
    EUR: { symbol: "€", rate: 0.011 },
    GBP: { symbol: "£", rate: 0.0095 }
  },
  activeCategory: "all",
  activeFabrics: [],
  activeSizes: [],
  maxPrice: 2500,
  feedingFriendlyOnly: false,
  searchQuery: "",
  sortBy: "featured",
  appliedCoupon: null,
  currentUser: {
    name: "Pooja Sharma",
    email: "pooja.sharma@example.com",
    phone: "+91 98201 45678",
    address: "Flat 402, Sea View Apts, Perry Cross Rd, Bandra West, Mumbai 400050"
  },
  currentCheckoutOrder: null
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  loadStateFromLocalStorage();
  setupEventListeners();
  renderStorefront();
  updateCartUI();
  updateWishlistUI();
  setupAdminPortal();
});

// Load / Persist State
function loadStateFromLocalStorage() {
  const savedProducts = localStorage.getItem("SEN_PRODUCTS");
  storeState.products = savedProducts ? JSON.parse(savedProducts) : [...DEFAULT_PRODUCTS];

  const savedCart = localStorage.getItem("SEN_CART");
  storeState.cart = savedCart ? JSON.parse(savedCart) : [];

  const savedWishlist = localStorage.getItem("SEN_WISHLIST");
  storeState.wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];

  const savedCoupons = localStorage.getItem("SEN_COUPONS");
  storeState.coupons = savedCoupons ? JSON.parse(savedCoupons) : [...DEFAULT_COUPONS];

  const savedOrders = localStorage.getItem("SEN_ORDERS");
  storeState.orders = savedOrders ? JSON.parse(savedOrders) : [...DEFAULT_ORDERS];
}

function saveStateToLocalStorage() {
  localStorage.setItem("SEN_PRODUCTS", JSON.stringify(storeState.products));
  localStorage.setItem("SEN_CART", JSON.stringify(storeState.cart));
  localStorage.setItem("SEN_WISHLIST", JSON.stringify(storeState.wishlist));
  localStorage.setItem("SEN_COUPONS", JSON.stringify(storeState.coupons));
  localStorage.setItem("SEN_ORDERS", JSON.stringify(storeState.orders));
}

// Currency Formatter
function formatPrice(amountInINR) {
  const curr = storeState.currencyRates[storeState.activeCurrency];
  const converted = Math.round(amountInINR * curr.rate);
  return `${curr.symbol}${converted.toLocaleString("en-IN")}`;
}

// Event Listeners
function setupEventListeners() {
  // Category Nav Clicks
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", (e) => {
      const cat = item.getAttribute("data-category");
      if (cat) {
        document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
        item.classList.add("active");
        filterByCategory(cat);
      }
    });
  });

  // Category Tiles
  document.querySelectorAll(".cat-tile-card").forEach(tile => {
    tile.addEventListener("click", () => {
      const cat = tile.getAttribute("data-cat");
      document.querySelectorAll(".cat-tile-card").forEach(t => t.classList.remove("active"));
      tile.classList.add("active");
      filterByCategory(cat);
      const catalogEl = document.getElementById("catalog");
      if (catalogEl) catalogEl.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Search Input
  const searchInput = document.getElementById("searchInput");
  const searchClearBtn = document.getElementById("searchClearBtn");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      storeState.searchQuery = e.target.value.toLowerCase().trim();
      searchClearBtn.style.display = storeState.searchQuery ? "inline-block" : "none";
      renderProductsGrid();
    });
  }
  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", () => {
      searchInput.value = "";
      storeState.searchQuery = "";
      searchClearBtn.style.display = "none";
      renderProductsGrid();
    });
  }

  // Currency Selector
  const currencySelector = document.getElementById("currencySelector");
  if (currencySelector) {
    currencySelector.addEventListener("change", (e) => {
      storeState.activeCurrency = e.target.value;
      renderProductsGrid();
      updateCartUI();
      showToast(`Currency updated to ${storeState.activeCurrency}`);
    });
  }

  // Filter Sidebar: Radio Category
  document.querySelectorAll("input[name='catFilter']").forEach(radio => {
    radio.addEventListener("change", (e) => {
      storeState.activeCategory = e.target.value;
      renderProductsGrid();
    });
  });

  // Filter Sidebar: Fabric Checkboxes
  document.querySelectorAll(".fabric-checkbox").forEach(cb => {
    cb.addEventListener("change", () => {
      storeState.activeFabrics = Array.from(document.querySelectorAll(".fabric-checkbox:checked")).map(c => c.value);
      renderProductsGrid();
    });
  });

  // Filter Sidebar: Size Pills
  document.querySelectorAll(".size-pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const size = btn.getAttribute("data-size");
      btn.classList.toggle("active");
      if (btn.classList.contains("active")) {
        storeState.activeSizes.push(size);
      } else {
        storeState.activeSizes = storeState.activeSizes.filter(s => s !== size);
      }
      renderProductsGrid();
    });
  });

  // Filter Sidebar: Price Slider
  const priceSlider = document.getElementById("priceRangeSlider");
  const priceDisplay = document.getElementById("priceRangeDisplay");
  if (priceSlider) {
    priceSlider.addEventListener("input", (e) => {
      storeState.maxPrice = parseInt(e.target.value);
      if (priceDisplay) priceDisplay.textContent = `Up to ₹${storeState.maxPrice.toLocaleString()}`;
      renderProductsGrid();
    });
  }

  // Filter Sidebar: Feeding Friendly
  const feedingCheck = document.getElementById("feedingFriendlyCheck");
  if (feedingCheck) {
    feedingCheck.addEventListener("change", (e) => {
      storeState.feedingFriendlyOnly = e.target.checked;
      renderProductsGrid();
    });
  }

  // Reset Filters Button
  const btnReset = document.getElementById("btnResetFilters");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      storeState.activeCategory = "all";
      storeState.activeFabrics = [];
      storeState.activeSizes = [];
      storeState.maxPrice = 2500;
      storeState.feedingFriendlyOnly = false;
      storeState.searchQuery = "";
      
      document.querySelectorAll("input[name='catFilter']")[0].checked = true;
      document.querySelectorAll(".fabric-checkbox").forEach(c => c.checked = false);
      document.querySelectorAll(".size-pill-btn").forEach(b => b.classList.remove("active"));
      if (priceSlider) priceSlider.value = 2500;
      if (priceDisplay) priceDisplay.textContent = "Up to ₹2,500";
      if (feedingCheck) feedingCheck.checked = false;
      if (searchInput) searchInput.value = "";
      
      renderProductsGrid();
      showToast("Filters reset to default");
    });
  }

  // Sorting
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      storeState.sortBy = e.target.value;
      renderProductsGrid();
    });
  }

  // Drawers & Modals
  document.getElementById("btnOpenCart")?.addEventListener("click", openCartDrawer);
  document.getElementById("btnCloseCart")?.addEventListener("click", closeCartDrawer);
  document.getElementById("cartOverlay")?.addEventListener("click", closeCartDrawer);
  document.getElementById("btnOpenWishlist")?.addEventListener("click", () => openAccountModal("wishlist"));
  document.getElementById("btnOpenAccount")?.addEventListener("click", () => openAccountModal("orders"));
  document.getElementById("btnOpenSizeGuideFromFilter")?.addEventListener("click", openSizeGuideModal);

  // Cart Drawer Actions
  document.getElementById("btnApplyCoupon")?.addEventListener("click", applyCouponCode);
  document.getElementById("btnOpenCheckout")?.addEventListener("click", openCheckoutModal);
  document.getElementById("btnQuickWhatsAppCart")?.addEventListener("click", sendEntireCartToWhatsApp);

  // Checkout Flow
  setupCheckoutFlow();

  // Admin Portal Trigger
  document.getElementById("btnOpenAdmin")?.addEventListener("click", openAdminModal);

  // Newsletter
  document.getElementById("btnNewsletterSubscribe")?.addEventListener("click", () => {
    const input = document.getElementById("newsletterEmailInput");
    if (input && input.value.includes("@")) {
      showToast("Thank you for subscribing to Suneeta Elco updates!");
      input.value = "";
    } else {
      showToast("Please enter a valid email address.");
    }
  });

  // Profile Save
  document.getElementById("btnSaveProfile")?.addEventListener("click", () => {
    storeState.currentUser.name = document.getElementById("profileName").value;
    storeState.currentUser.phone = document.getElementById("profilePhone").value;
    storeState.currentUser.email = document.getElementById("profileEmail").value;
    storeState.currentUser.address = document.getElementById("profileAddress").value;
    showToast("Profile details updated successfully!");
  });
}

// Category Filter Helper
function filterByCategory(category) {
  storeState.activeCategory = category;
  const radio = document.querySelector(`input[name='catFilter'][value='${category}']`);
  if (radio) radio.checked = true;
  renderProductsGrid();
}

// Render Products Grid
function renderProductsGrid() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  let filtered = storeState.products.filter(p => {
    // Category
    if (storeState.activeCategory !== "all" && p.category !== storeState.activeCategory) return false;
    // Fabrics
    if (storeState.activeFabrics.length > 0 && !storeState.activeFabrics.includes(p.fabric)) return false;
    // Sizes
    if (storeState.activeSizes.length > 0) {
      const hasSize = p.sizes.some(s => storeState.activeSizes.includes(s));
      if (!hasSize) return false;
    }
    // Price
    if (p.price > storeState.maxPrice) return false;
    // Feeding Friendly
    if (storeState.feedingFriendlyOnly && !p.isFeedingFriendly) return false;
    // Search
    if (storeState.searchQuery) {
      const q = storeState.searchQuery;
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchFabric = p.fabric.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCat = p.categoryName.toLowerCase().includes(q);
      if (!matchTitle && !matchFabric && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  // Sorting
  if (storeState.sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (storeState.sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (storeState.sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (storeState.sortBy === "discount") {
    filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
  }

  // Update Visible Count
  const countEl = document.getElementById("visibleProductsCount");
  if (countEl) countEl.textContent = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 4rem 1rem; background:#fff; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
        <i class="fa-solid fa-shirt" style="font-size:3rem; color:var(--color-primary); opacity:0.6; margin-bottom:1rem;"></i>
        <h3 style="font-family:var(--font-heading); font-size:1.4rem; margin-bottom:0.5rem;">No Designs Found</h3>
        <p style="color:var(--text-muted); font-size:0.9rem; max-width:400px; margin:0 auto 1.5rem;">
          Try broadening your filter criteria or search terms to explore our Jaipuri & Batik collection.
        </p>
        <button class="btn-primary" onclick="document.getElementById('btnResetFilters').click()">View All Designs</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const isWishlisted = storeState.wishlist.some(w => w.id === p.id);
    return `
      <div class="product-card" data-id="${p.id}">
        <div class="product-thumb-wrap">
          <img src="${p.images[0]}" alt="${p.title}" class="product-img" loading="lazy" />
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          <button class="product-wish-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${p.id}')" title="Save to Wishlist">
            <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
          </button>
          <button class="quick-view-overlay-btn" onclick="openQuickView('${p.id}')">
            <i class="fa-regular fa-eye"></i> Quick View
          </button>
        </div>

        <div class="product-info">
          <div class="product-fabric-tag">${p.fabric}</div>
          <h3 class="product-title" title="${p.title}">${p.title}</h3>
          
          <div class="product-rating-row">
            <span class="rating-stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}</span>
            <span><strong>${p.rating}</strong> (${p.reviewsCount})</span>
          </div>

          <div class="product-price-row">
            <span class="price-current">${formatPrice(p.price)}</span>
            ${p.originalPrice ? `<span class="price-original">${formatPrice(p.originalPrice)}</span>` : ''}
            ${p.discount ? `<span class="price-discount-pill">${p.discount}% OFF</span>` : ''}
          </div>

          <div class="product-swatches-row">
            ${p.colors ? p.colors.map(c => `<span class="swatch-dot" style="background:${c};" title="Available Color"></span>`).join('') : ''}
            <span style="font-size:0.75rem; color:var(--text-light); margin-left:0.3rem;">Sizes: ${p.sizes.slice(0, 3).join(', ')}${p.sizes.length > 3 ? '...' : ''}</span>
          </div>

          <div class="product-card-actions">
            <button class="btn-card-cart" onclick="quickAddToCart('${p.id}')">
              <i class="fa-solid fa-bag-shopping"></i> Add to Bag
            </button>
            <button class="btn-card-whatsapp" onclick="sendProductToWhatsApp('${p.id}')" title="Buy Directly on WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Initial Storefront Rendering
function renderStorefront() {
  renderProductsGrid();

  // Category counts
  const countNighties = storeState.products.filter(p => p.category === "nighties").length;
  const countKaftans = storeState.products.filter(p => p.category === "kaftans").length;
  const countNightsuits = storeState.products.filter(p => p.category === "nightsuits").length;
  
  if (document.getElementById("catCountAll")) document.getElementById("catCountAll").textContent = `${storeState.products.length} Designs`;
  if (document.getElementById("catCountNighties")) document.getElementById("catCountNighties").textContent = `${countNighties} Designs`;
  if (document.getElementById("catCountKaftans")) document.getElementById("catCountKaftans").textContent = `${countKaftans} Designs`;
  if (document.getElementById("catCountNightsuits")) document.getElementById("catCountNightsuits").textContent = `${countNightsuits} Designs`;
}

// Quick View Modal
function openQuickView(productId) {
  const product = storeState.products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("quickViewModal");
  const overlay = document.getElementById("quickViewOverlay");
  const modalBody = document.getElementById("qvModalBody");
  const modalTitle = document.getElementById("qvModalTitle");

  if (!modal || !modalBody) return;

  modalTitle.textContent = product.title;
  modalBody.innerHTML = `
    <div class="quickview-grid">
      <div class="quickview-gallery-main">
        <img src="${product.images[0]}" alt="${product.title}" id="qvMainImg" />
      </div>
      <div>
        <div class="product-fabric-tag">${product.fabric}</div>
        <h2 style="font-family:var(--font-heading); font-size:1.5rem; margin-bottom:0.4rem;">${product.title}</h2>
        
        <div class="product-rating-row">
          <span class="rating-stars">★★★★★</span>
          <span><strong>${product.rating} / 5.0</strong> (${product.reviewsCount} verified reviews)</span>
        </div>

        <div class="product-price-row" style="margin:1rem 0;">
          <span class="price-current" style="font-size:1.6rem;">${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="price-original" style="font-size:1.1rem;">${formatPrice(product.originalPrice)}</span>` : ''}
          ${product.discount ? `<span class="price-discount-pill" style="font-size:0.85rem;">SAVE ${product.discount}%</span>` : ''}
        </div>

        <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin-bottom:1.25rem;">
          ${product.description}
        </p>

        <!-- Sizing Selection -->
        <div style="margin-bottom:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <label style="font-size:0.85rem; font-weight:700;">Select Size:</label>
            <button onclick="openSizeGuideModal()" style="font-size:0.8rem; color:var(--color-primary); text-decoration:underline;">Size Chart</button>
          </div>
          <div class="size-pill-grid" id="qvSizeGrid">
            ${product.sizes.map((s, idx) => `
              <button class="size-pill-btn ${idx === 0 ? 'active' : ''}" onclick="selectQvSize(this, '${s}')">${s}</button>
            `).join('')}
          </div>
        </div>

        <!-- Pincode Checker Preview -->
        <div style="background:var(--bg-subtle); padding:0.85rem; border-radius:var(--radius-sm); margin-bottom:1.25rem; font-size:0.82rem;">
          <div style="font-weight:700; margin-bottom:0.25rem;"><i class="fa-solid fa-location-dot"></i> Check Delivery to your Pincode</div>
          <div style="display:flex; gap:0.5rem;">
            <input type="text" id="qvPincodeInput" placeholder="Enter 6-digit Pincode (e.g. 400050)" style="background:#fff; border:1px solid #ccc; padding:0.3rem 0.6rem; border-radius:4px; font-size:0.8rem; width:170px;" maxlength="6" />
            <button class="btn-secondary" onclick="checkQvPincode()" style="font-size:0.75rem; padding:0.3rem 0.75rem; background:#fff; color:#333; border:1px solid #bbb;">Check</button>
          </div>
          <div id="qvPincodeResult" style="margin-top:0.35rem; color:var(--color-emerald); font-weight:600;"></div>
        </div>

        <!-- Actions -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
          <button class="btn-primary" onclick="addQvToCart('${product.id}')" style="justify-content:center;">
            <i class="fa-solid fa-bag-shopping"></i> Add to Bag
          </button>
          <button class="btn-secondary" onclick="sendProductToWhatsApp('${product.id}')" style="justify-content:center; background:#25D366; border-color:#25D366; color:#fff;">
            <i class="fa-brands fa-whatsapp"></i> Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
  overlay.classList.add("active");
}

let currentSelectedQvSize = "M";
function selectQvSize(btn, size) {
  document.querySelectorAll("#qvSizeGrid .size-pill-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentSelectedQvSize = size;
}

function checkQvPincode() {
  const pin = document.getElementById("qvPincodeInput")?.value.trim();
  const res = document.getElementById("qvPincodeResult");
  if (!res) return;

  if (PINCODE_DIRECTORY[pin]) {
    res.innerHTML = `<i class="fa-solid fa-truck-fast"></i> Delivery to <strong>${PINCODE_DIRECTORY[pin].city}</strong>: ${PINCODE_DIRECTORY[pin].estDays}`;
  } else if (pin.length === 6) {
    res.innerHTML = `<i class="fa-solid fa-truck-fast"></i> Delivery to Pincode ${pin}: 3-4 Business Days (Express Courier)`;
  } else {
    res.innerHTML = `<span style="color:#E63946;">Please enter a valid 6-digit Indian Pincode.</span>`;
  }
}

function addQvToCart(productId) {
  const product = storeState.products.find(p => p.id === productId);
  if (!product) return;

  const size = currentSelectedQvSize || product.sizes[0];
  addToCart(product, size);
  closeAllModals();
  openCartDrawer();
}

// Cart Logic
function quickAddToCart(productId) {
  const product = storeState.products.find(p => p.id === productId);
  if (!product) return;
  const defaultSize = product.sizes[0] || "Free Size";
  addToCart(product, defaultSize);
  openCartDrawer();
}

function addToCart(product, size) {
  const existingIndex = storeState.cart.findIndex(i => i.id === product.id && i.size === size);
  if (existingIndex > -1) {
    storeState.cart[existingIndex].quantity += 1;
  } else {
    storeState.cart.push({
      id: product.id,
      title: product.title,
      fabric: product.fabric,
      price: product.price,
      image: product.images[0],
      size: size,
      color: product.colorNames ? product.colorNames[0] : "Standard",
      quantity: 1
    });
  }
  saveStateToLocalStorage();
  updateCartUI();
  showToast(`Added "${product.title}" (${size}) to bag!`);
}

function updateCartQty(index, delta) {
  if (storeState.cart[index]) {
    storeState.cart[index].quantity += delta;
    if (storeState.cart[index].quantity <= 0) {
      storeState.cart.splice(index, 1);
    }
    saveStateToLocalStorage();
    updateCartUI();
  }
}

function removeCartItem(index) {
  storeState.cart.splice(index, 1);
  saveStateToLocalStorage();
  updateCartUI();
  showToast("Item removed from bag.");
}

function updateCartUI() {
  const cartBadge = document.getElementById("cartCountBadge");
  const drawerItemCount = document.getElementById("drawerItemCount");
  const container = document.getElementById("cartItemsContainer");
  const subtotalEl = document.getElementById("cartSubtotalText");
  const totalEl = document.getElementById("cartTotalText");
  const discountRow = document.getElementById("cartDiscountRow");
  const discountEl = document.getElementById("cartDiscountText");
  const appliedCouponLabel = document.getElementById("appliedCouponLabel");
  const shippingBar = document.getElementById("shippingProgressBar");
  const shippingText = document.getElementById("shippingProgressText");

  const totalItems = storeState.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) cartBadge.textContent = totalItems;
  if (drawerItemCount) drawerItemCount.textContent = totalItems;

  if (!container) return;

  if (storeState.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem;">
        <i class="fa-solid fa-bag-shopping" style="font-size:3rem; color:var(--text-light); margin-bottom:1rem;"></i>
        <h4 style="font-family:var(--font-heading); margin-bottom:0.4rem;">Your Bag is Empty</h4>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.5rem;">Explore our Batik & Jaipuri collection for pure cotton comfort.</p>
        <button class="btn-primary" onclick="closeCartDrawer(); window.location.href='#catalog';">Start Shopping</button>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = formatPrice(0);
    if (totalEl) totalEl.textContent = formatPrice(0);
    if (discountRow) discountRow.style.display = "none";
    if (shippingBar) shippingBar.style.width = "0%";
    if (shippingText) shippingText.textContent = "Add ₹999 for FREE Delivery Across India";
    return;
  }

  // Render Items
  container.innerHTML = storeState.cart.map((item, idx) => `
    <div class="cart-item-row">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <div class="cart-item-variant">Size: <strong>${item.size}</strong> • ${item.fabric}</div>
        <div class="cart-qty-control">
          <button class="qty-btn" onclick="updateCartQty(${idx}, -1)">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQty(${idx}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-price-side">
        <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
        <button class="cart-item-remove" onclick="removeCartItem(${idx})">Remove</button>
      </div>
    </div>
  `).join("");

  // Subtotal & Calculations
  const subtotal = storeState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;

  if (storeState.appliedCoupon) {
    if (subtotal >= storeState.appliedCoupon.minOrder) {
      discount = (subtotal * storeState.appliedCoupon.discountPercent) / 100;
      if (discountRow) discountRow.style.display = "flex";
      if (appliedCouponLabel) appliedCouponLabel.textContent = storeState.appliedCoupon.code;
      if (discountEl) discountEl.textContent = `-${formatPrice(discount)}`;
    } else {
      storeState.appliedCoupon = null;
      if (discountRow) discountRow.style.display = "none";
    }
  } else {
    if (discountRow) discountRow.style.display = "none";
  }

  const grandTotal = Math.max(0, subtotal - discount);
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl) totalEl.textContent = formatPrice(grandTotal);

  // Free Shipping Meter (Threshold ₹999)
  const freeThreshold = 999;
  if (subtotal >= freeThreshold) {
    if (shippingBar) shippingBar.style.width = "100%";
    if (shippingText) shippingText.innerHTML = `🎉 <strong>Congratulations!</strong> You qualify for FREE All-India Delivery!`;
  } else {
    const diff = freeThreshold - subtotal;
    const pct = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
    if (shippingBar) shippingBar.style.width = `${pct}%`;
    if (shippingText) shippingText.innerHTML = `Add <strong>${formatPrice(diff)}</strong> more to get <strong>FREE Express Shipping</strong>!`;
  }
}

function applyCouponCode() {
  const input = document.getElementById("couponInput");
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  if (!code) return;

  const found = storeState.coupons.find(c => c.code === code);
  if (found) {
    const subtotal = storeState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotal < found.minOrder) {
      showToast(`Coupon valid on minimum orders of ${formatPrice(found.minOrder)}`);
      return;
    }
    storeState.appliedCoupon = found;
    updateCartUI();
    showToast(`Applied ${found.code} successfully! (${found.discountPercent}% OFF)`);
    input.value = "";
  } else {
    showToast("Invalid coupon code. Try BANDRAELCO or WELCOME10");
  }
}

function openCartDrawer() {
  document.getElementById("cartDrawer")?.classList.add("active");
  document.getElementById("cartOverlay")?.classList.add("active");
}

function closeCartDrawer() {
  document.getElementById("cartDrawer")?.classList.remove("active");
  document.getElementById("cartOverlay")?.classList.remove("active");
}

// Wishlist Logic
function toggleWishlist(productId) {
  const p = storeState.products.find(item => item.id === productId);
  if (!p) return;

  const idx = storeState.wishlist.findIndex(w => w.id === productId);
  if (idx > -1) {
    storeState.wishlist.splice(idx, 1);
    showToast(`Removed "${p.title}" from wishlist.`);
  } else {
    storeState.wishlist.push(p);
    showToast(`Saved "${p.title}" to your wishlist!`);
  }
  saveStateToLocalStorage();
  updateWishlistUI();
  renderProductsGrid();
}

function updateWishlistUI() {
  const badge = document.getElementById("wishlistCountBadge");
  if (badge) badge.textContent = storeState.wishlist.length;
}

// WhatsApp Direct Ordering
function sendProductToWhatsApp(productId) {
  const p = storeState.products.find(item => item.id === productId);
  if (!p) return;

  const text = `*New Order Inquiry - Suneeta Elco Nighties*\n\n` +
    `👗 *Product:* ${p.title}\n` +
    `🧵 *Fabric:* ${p.fabric}\n` +
    `💰 *Price:* ₹${p.price}\n` +
    `📍 *Store Location:* Elco Market, Bandra West, Mumbai\n\n` +
    `Please share availability and sizes!`;

  window.open(`https://wa.me/919869103220?text=${encodeURIComponent(text)}`, "_blank");
}

function sendEntireCartToWhatsApp() {
  if (storeState.cart.length === 0) {
    showToast("Your shopping bag is empty!");
    return;
  }

  let text = `*🛍️ Suneeta Elco Nighties — Direct WhatsApp Order*\n\n` +
    `*Customer:* ${storeState.currentUser.name} (${storeState.currentUser.phone})\n` +
    `*Delivery Address:* ${storeState.currentUser.address}\n\n` +
    `*Order Items:*\n`;

  storeState.cart.forEach((item, i) => {
    text += `${i + 1}. ${item.title} (Size: ${item.size}) x ${item.quantity} = ₹${item.price * item.quantity}\n`;
  });

  const subtotal = storeState.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  text += `\n*Total Amount:* ₹${subtotal}\n*Payment Mode:* WhatsApp Direct Confirmation\n\nPlease confirm availability and dispatch from Bandra Elco store!`;

  window.open(`https://wa.me/919869103220?text=${encodeURIComponent(text)}`, "_blank");
}

// ==========================================================================
// CHECKOUT & PAYMENT WORKFLOW
// ==========================================================================
function setupCheckoutFlow() {
  // Pincode auto-lookup in checkout
  const pinInput = document.getElementById("chkPincode");
  if (pinInput) {
    pinInput.addEventListener("input", (e) => {
      const pin = e.target.value.trim();
      const cityInput = document.getElementById("chkCity");
      const stateInput = document.getElementById("chkState");
      const estInput = document.getElementById("chkEstDelivery");

      if (PINCODE_DIRECTORY[pin]) {
        if (cityInput) cityInput.value = PINCODE_DIRECTORY[pin].city;
        if (stateInput) stateInput.value = PINCODE_DIRECTORY[pin].state;
        if (estInput) estInput.value = PINCODE_DIRECTORY[pin].estDays;
      }
    });
  }

  // Step 1 -> Step 2
  document.getElementById("btnProceedToPayment")?.addEventListener("click", () => {
    const name = document.getElementById("chkName").value.trim();
    const phone = document.getElementById("chkPhone").value.trim();
    const email = document.getElementById("chkEmail").value.trim();
    const address = document.getElementById("chkAddress").value.trim();

    if (!name || !phone || !address) {
      showToast("Please fill in your name, phone number, and address.");
      return;
    }

    // Switch to step 2
    document.getElementById("checkoutStep1").style.display = "none";
    document.getElementById("checkoutStep2").style.display = "block";
    document.getElementById("chkStep1Header").classList.remove("active");
    document.getElementById("chkStep2Header").classList.add("active");

    const subtotal = storeState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = storeState.appliedCoupon ? (subtotal * storeState.appliedCoupon.discountPercent) / 100 : 0;
    const payable = Math.max(0, subtotal - discount);

    document.getElementById("chkPayableAmount").textContent = formatPrice(payable);
  });

  // Step 2 -> Step 1 (Back)
  document.getElementById("btnBackToAddress")?.addEventListener("click", () => {
    document.getElementById("checkoutStep1").style.display = "block";
    document.getElementById("checkoutStep2").style.display = "none";
    document.getElementById("chkStep2Header").classList.remove("active");
    document.getElementById("chkStep1Header").classList.add("active");
  });

  // Payment Tabs Switcher
  document.querySelectorAll(".payment-tab-btn").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".payment-tab-btn").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".payment-tab-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");

      const method = tab.getAttribute("data-paymethod");
      if (method === "upi") document.getElementById("payPanelUpi").classList.add("active");
      if (method === "card") document.getElementById("payPanelCard").classList.add("active");
      if (method === "netbanking") document.getElementById("payPanelNetbanking").classList.add("active");
      if (method === "cod") document.getElementById("payPanelCod").classList.add("active");
    });
  });

  // Auto-fill Test Card
  document.getElementById("btnAutoFillTestCard")?.addEventListener("click", () => {
    document.getElementById("cardNumInput").value = "4111 2222 3333 4444";
    document.getElementById("cardNameInput").value = "Pooja Sharma";
    document.getElementById("cardExpInput").value = "12/28";
    document.getElementById("cardCvvInput").value = "889";
    showToast("Test card details filled!");
  });

  // Payment Confirm Handlers
  document.getElementById("btnSimulateUpiPay")?.addEventListener("click", () => completeOrder("UPI (Instant QR)", "PAID"));
  document.getElementById("btnSubmitCardPay")?.addEventListener("click", () => completeOrder("Credit/Debit Card", "PAID"));
  document.getElementById("btnSubmitNetBankPay")?.addEventListener("click", () => {
    const bank = document.getElementById("netBankSelect")?.value || "NetBanking";
    completeOrder(`Net Banking (${bank})`, "PAID");
  });
  document.getElementById("btnConfirmCodOrder")?.addEventListener("click", () => completeOrder("Cash on Delivery (COD)", "PENDING_COD"));
}

function openCheckoutModal() {
  if (storeState.cart.length === 0) {
    showToast("Your shopping bag is empty!");
    return;
  }
  closeCartDrawer();

  // Populate default user info
  document.getElementById("chkName").value = storeState.currentUser.name || "";
  document.getElementById("chkPhone").value = storeState.currentUser.phone || "";
  document.getElementById("chkEmail").value = storeState.currentUser.email || "";
  document.getElementById("chkAddress").value = storeState.currentUser.address || "";
  document.getElementById("chkPincode").value = "400050";
  document.getElementById("chkCity").value = "Mumbai (Bandra West)";
  document.getElementById("chkState").value = "Maharashtra";

  document.getElementById("checkoutStep1").style.display = "block";
  document.getElementById("checkoutStep2").style.display = "none";
  document.getElementById("chkStep1Header").classList.add("active");
  document.getElementById("chkStep2Header").classList.remove("active");
  document.getElementById("chkStep3Header").classList.remove("active");

  document.getElementById("checkoutModal")?.classList.add("active");
  document.getElementById("checkoutOverlay")?.classList.add("active");
}

function completeOrder(paymentMethod, paymentStatus) {
  const orderNum = Math.floor(1000 + Math.random() * 9000);
  const orderId = `SEN-2026-${orderNum}`;
  const subtotal = storeState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = storeState.appliedCoupon ? (subtotal * storeState.appliedCoupon.discountPercent) / 100 : 0;
  const grandTotal = Math.max(0, subtotal - discount);

  const newOrder = {
    id: orderId,
    date: new Date().toISOString(),
    customer: {
      name: document.getElementById("chkName").value || "Customer",
      phone: document.getElementById("chkPhone").value || "+91 98691 03220",
      email: document.getElementById("chkEmail").value || "customer@example.com",
      address: document.getElementById("chkAddress").value || "Bandra West",
      city: document.getElementById("chkCity").value || "Mumbai",
      state: document.getElementById("chkState").value || "Maharashtra",
      pincode: document.getElementById("chkPincode").value || "400050"
    },
    items: [...storeState.cart],
    pricing: {
      subtotal: subtotal,
      discount: discount,
      couponCode: storeState.appliedCoupon ? storeState.appliedCoupon.code : null,
      shippingFee: 0,
      total: grandTotal
    },
    paymentMethod: paymentMethod,
    paymentStatus: paymentStatus,
    orderStatus: "Processing",
    trackingTimeline: [
      { status: "Order Placed", time: "Just now", done: true },
      { status: "Confirmed at Bandra Elco Store", time: "Processing", done: true },
      { status: "Packed & Quality Checked", time: "Pending", done: false },
      { status: "Dispatched via Express Courier", time: "Pending", done: false },
      { status: "Out for Delivery", time: "Expected 1-2 Days", done: false }
    ],
    transactionRef: `${paymentMethod.slice(0, 3).toUpperCase()}-TXN-${Date.now().toString().slice(-8)}`
  };

  storeState.orders.unshift(newOrder);
  storeState.cart = [];
  storeState.appliedCoupon = null;
  saveStateToLocalStorage();
  updateCartUI();

  // Close checkout modal
  closeAllModals();

  // Open invoice & confirmation modal
  showOrderConfirmation(newOrder);
}

function showOrderConfirmation(order) {
  storeState.currentCheckoutOrder = order;

  document.getElementById("invOrderId").textContent = `#${order.id}`;
  document.getElementById("invOrderDate").textContent = new Date(order.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' });
  document.getElementById("invCustomerName").textContent = order.customer.name;
  document.getElementById("invCustomerAddress").textContent = order.customer.address;
  document.getElementById("invCustomerCity").textContent = `${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`;
  document.getElementById("invCustomerPhone").textContent = `Phone: ${order.customer.phone}`;
  document.getElementById("invPaymentMethod").textContent = order.paymentMethod;
  document.getElementById("invPaymentStatus").textContent = order.paymentStatus;
  document.getElementById("invTxnRef").textContent = order.transactionRef;

  const tableBody = document.getElementById("invItemsTableBody");
  tableBody.innerHTML = order.items.map(item => `
    <tr>
      <td style="text-align:left;">
        <strong>${item.title}</strong><br />
        <span style="font-size:0.75rem; color:#777;">Size: ${item.size} • ${item.fabric}</span>
      </td>
      <td>${item.quantity}</td>
      <td>${formatPrice(item.price)}</td>
      <td>${formatPrice(item.price * item.quantity)}</td>
    </tr>
  `).join("");

  document.getElementById("invSubtotal").textContent = formatPrice(order.pricing.subtotal);
  document.getElementById("invDiscount").textContent = `-${formatPrice(order.pricing.discount)}`;
  document.getElementById("invGrandTotal").textContent = formatPrice(order.pricing.total);

  // Stepper
  const stepper = document.getElementById("invTrackingStepper");
  stepper.innerHTML = order.trackingTimeline.map(step => `
    <div class="tracking-step-row ${step.done ? 'done' : ''}">
      <div class="step-dot"></div>
      <div>
        <div style="font-weight:700; font-size:0.88rem; color:${step.done ? 'var(--color-emerald)' : 'var(--text-muted)'};">${step.status}</div>
        <div style="font-size:0.75rem; color:var(--text-light);">${step.time}</div>
      </div>
    </div>
  `).join("");

  // WhatsApp Link for this order
  const waBtn = document.getElementById("btnWhatsAppOrderCopy");
  const waText = `*Confirmed Order #${order.id}*\n` +
    `*Customer:* ${order.customer.name}\n` +
    `*Total Paid:* ₹${order.pricing.total}\n` +
    `*Delivery To:* ${order.customer.address}, ${order.customer.city} (${order.customer.pincode})\n` +
    `Please proceed with packing at Elco Market store!`;
  waBtn.href = `https://wa.me/919869103220?text=${encodeURIComponent(waText)}`;

  document.getElementById("orderConfirmModal")?.classList.add("active");
  document.getElementById("orderConfirmOverlay")?.classList.add("active");
  showToast(`Order #${order.id} placed successfully!`);
}

// ==========================================================================
// CUSTOMER ACCOUNT & ORDER TRACKING
// ==========================================================================
function openAccountModal(initialTab = "orders") {
  document.querySelectorAll(".account-tab-panel").forEach(p => p.style.display = "none");
  document.querySelectorAll("[data-acctab]").forEach(b => b.classList.remove("active"));

  if (initialTab === "orders") {
    document.getElementById("accTabOrders").style.display = "block";
    document.querySelector("[data-acctab='orders']")?.classList.add("active");
    renderAccountOrders();
  } else if (initialTab === "profile") {
    document.getElementById("accTabProfile").style.display = "block";
    document.querySelector("[data-acctab='profile']")?.classList.add("active");
  } else if (initialTab === "wishlist") {
    document.getElementById("accTabWishlist").style.display = "block";
    document.querySelector("[data-acctab='wishlist']")?.classList.add("active");
    renderAccountWishlist();
  }

  document.getElementById("accountModal")?.classList.add("active");
  document.getElementById("accountOverlay")?.classList.add("active");
}

function renderAccountOrders() {
  const container = document.getElementById("accOrdersListContainer");
  if (!container) return;

  if (storeState.orders.length === 0) {
    container.innerHTML = `<p style="text-align:center; padding:2rem; color:var(--text-muted);">No orders found.</p>`;
    return;
  }

  container.innerHTML = storeState.orders.map(order => `
    <div style="background:var(--bg-subtle); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1rem; border:1px solid var(--border-subtle);">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #ddd; padding-bottom:0.75rem; margin-bottom:0.75rem;">
        <div>
          <strong style="font-size:0.95rem; color:var(--color-secondary);">Order #${order.id}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${new Date(order.date).toLocaleDateString("en-IN")}</div>
        </div>
        <div>
          <span style="background:var(--color-primary-light); color:var(--color-primary); font-size:0.75rem; font-weight:700; padding:0.2rem 0.6rem; border-radius:var(--radius-pill);">${order.orderStatus}</span>
        </div>
      </div>

      <div style="font-size:0.85rem; margin-bottom:0.75rem;">
        ${order.items.map(item => `<div>• ${item.title} (${item.size}) x ${item.quantity}</div>`).join('')}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.88rem;">
        <strong>Total: ${formatPrice(order.pricing.total)}</strong>
        <button class="btn-secondary" onclick="showOrderConfirmation(storeState.orders.find(o => o.id === '${order.id}'))" style="font-size:0.78rem; padding:0.35rem 0.75rem;">
          View Invoice & Live Tracking
        </button>
      </div>
    </div>
  `).join("");
}

function renderAccountWishlist() {
  const container = document.getElementById("accWishlistContainer");
  if (!container) return;

  if (storeState.wishlist.length === 0) {
    container.innerHTML = `<p style="text-align:center; padding:2rem; color:var(--text-muted);">Your wishlist is empty.</p>`;
    return;
  }

  container.innerHTML = storeState.wishlist.map(p => `
    <div style="display:flex; align-items:center; gap:1rem; padding:0.75rem 0; border-bottom:1px solid var(--border-subtle);">
      <img src="${p.images[0]}" style="width:60px; height:75px; object-fit:cover; border-radius:4px;" />
      <div style="flex-grow:1;">
        <h4 style="font-size:0.9rem;">${p.title}</h4>
        <div style="font-weight:700; color:var(--color-primary);">${formatPrice(p.price)}</div>
      </div>
      <button class="btn-primary" onclick="quickAddToCart('${p.id}'); closeAllModals();" style="font-size:0.78rem; padding:0.4rem 0.75rem;">
        Add to Bag
      </button>
    </div>
  `).join("");
}

// ==========================================================================
// STORE ADMIN CONTROL CENTER
// ==========================================================================
function setupAdminPortal() {
  // Switch admin tabs
  document.querySelectorAll("[data-admintab]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-admintab]").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".admin-tab-view").forEach(v => v.style.display = "none");
      btn.classList.add("active");

      const tab = btn.getAttribute("data-admintab");
      if (tab === "products") document.getElementById("adminTabProducts").style.display = "block";
      if (tab === "orders") document.getElementById("adminTabOrders").style.display = "block";
      if (tab === "coupons") document.getElementById("adminTabCoupons").style.display = "block";
    });
  });

  // Add Product Form
  document.getElementById("btnOpenAddProductModal")?.addEventListener("click", () => {
    document.getElementById("productEditForm").reset();
    document.getElementById("editProductId").value = "";
    document.getElementById("productEditModalTitle").textContent = "Add New Product to Suneeta Elco";
    document.getElementById("productEditModal")?.classList.add("active");
    document.getElementById("productEditOverlay")?.classList.add("active");
  });

  // Save Product
  document.getElementById("productEditForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const editId = document.getElementById("editProductId").value;
    const title = document.getElementById("editProductTitle").value.trim();
    const category = document.getElementById("editProductCategory").value;
    const fabric = document.getElementById("editProductFabric").value;
    const price = parseInt(document.getElementById("editProductPrice").value);
    const origPrice = parseInt(document.getElementById("editProductOrigPrice").value) || price + 400;
    const image = document.getElementById("editProductImage").value.trim();
    const desc = document.getElementById("editProductDesc").value.trim();
    const stock = parseInt(document.getElementById("editProductStock").value) || 20;
    const badge = document.getElementById("editProductBadge").value.trim();

    if (editId) {
      // Edit existing
      const p = storeState.products.find(item => item.id === editId);
      if (p) {
        p.title = title;
        p.category = category;
        p.fabric = fabric;
        p.price = price;
        p.originalPrice = origPrice;
        p.images = [image];
        p.description = desc;
        p.stockCount = stock;
        p.badge = badge;
      }
      showToast("Product updated successfully!");
    } else {
      // Add new
      const newProduct = {
        id: `SEN-${Math.floor(120 + Math.random() * 800)}`,
        title: title,
        category: category,
        categoryName: category === "nighties" ? "Nighties & Gowns" : category === "kaftans" ? "Batik Kaftans" : "Night Suits",
        fabric: fabric,
        price: price,
        originalPrice: origPrice,
        discount: Math.round(((origPrice - price) / origPrice) * 100),
        rating: 5.0,
        reviewsCount: 1,
        badge: badge || "New",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["#C25B3E", "#1B365D"],
        colorNames: ["Terracotta", "Indigo"],
        images: [image],
        description: desc || "Handcrafted pure cotton sleepwear from Elco Market, Bandra West.",
        features: ["100% Pure Breathable Cotton", "Artisanal hand print", "Double stitched"],
        inStock: true,
        stockCount: stock,
        isFeedingFriendly: false
      };
      storeState.products.unshift(newProduct);
      showToast(`Added "${title}" to store catalog!`);
    }

    saveStateToLocalStorage();
    renderStorefront();
    renderAdminProductsTable();
    closeProductEditModal();
  });

  // Export Products CSV
  document.getElementById("btnExportProductsCsv")?.addEventListener("click", () => {
    let csv = "ID,Title,Category,Fabric,Price,Stock\n";
    storeState.products.forEach(p => {
      csv += `"${p.id}","${p.title}","${p.category}","${p.fabric}",${p.price},${p.stockCount}\n`;
    });
    downloadCSV("suneeta_elco_products.csv", csv);
  });

  // Export Orders CSV
  document.getElementById("btnExportOrdersCsv")?.addEventListener("click", () => {
    let csv = "OrderID,Date,Customer,Phone,City,Total,Payment,Status\n";
    storeState.orders.forEach(o => {
      csv += `"${o.id}","${o.date}","${o.customer.name}","${o.customer.phone}","${o.customer.city}",${o.pricing.total},"${o.paymentMethod}","${o.orderStatus}"\n`;
    });
    downloadCSV("suneeta_elco_orders.csv", csv);
  });
}

function openAdminModal() {
  updateAdminKPIs();
  renderAdminProductsTable();
  renderAdminOrdersTable();
  renderAdminCouponsTable();

  document.getElementById("adminModal")?.classList.add("active");
  document.getElementById("adminOverlay")?.classList.add("active");
}

function updateAdminKPIs() {
  const totalRevenue = storeState.orders.reduce((sum, o) => sum + o.pricing.total, 0);
  const totalOrders = storeState.orders.length;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  if (document.getElementById("kpiRevenue")) document.getElementById("kpiRevenue").textContent = formatPrice(totalRevenue);
  if (document.getElementById("kpiOrdersCount")) document.getElementById("kpiOrdersCount").textContent = totalOrders;
  if (document.getElementById("kpiProductsCount")) document.getElementById("kpiProductsCount").textContent = storeState.products.length;
  if (document.getElementById("kpiAov")) document.getElementById("kpiAov").textContent = formatPrice(aov);
}

function renderAdminProductsTable() {
  const body = document.getElementById("adminProductsTableBody");
  if (!body) return;

  body.innerHTML = storeState.products.map(p => `
    <tr>
      <td><img src="${p.images[0]}" style="width:40px; height:50px; object-fit:cover; border-radius:4px;" /></td>
      <td><strong>${p.title}</strong><br /><span style="font-size:0.75rem; color:#888;">${p.id}</span></td>
      <td>${p.category}</td>
      <td>${p.fabric}</td>
      <td>${formatPrice(p.price)}</td>
      <td>${p.stockCount} in stock</td>
      <td>
        <button onclick="editProductModal('${p.id}')" style="color:var(--color-primary); font-weight:600; margin-right:0.5rem;"><i class="fa-regular fa-pen-to-square"></i> Edit</button>
        <button onclick="deleteProduct('${p.id}')" style="color:#E63946; font-weight:600;"><i class="fa-regular fa-trash-can"></i></button>
      </td>
    </tr>
  `).join("");
}

function renderAdminOrdersTable() {
  const body = document.getElementById("adminOrdersTableBody");
  if (!body) return;

  body.innerHTML = storeState.orders.map(o => `
    <tr>
      <td><strong>#${o.id}</strong></td>
      <td>${new Date(o.date).toLocaleDateString("en-IN")}</td>
      <td>${o.customer.name}<br /><span style="font-size:0.75rem; color:#888;">${o.customer.phone}</span></td>
      <td><strong>${formatPrice(o.pricing.total)}</strong></td>
      <td><span style="font-size:0.75rem; font-weight:700;">${o.paymentMethod}</span></td>
      <td>
        <select onchange="updateOrderStatus('${o.id}', this.value)" style="border:1px solid #ccc; padding:2px 6px; border-radius:4px; font-size:0.8rem;">
          <option value="Processing" ${o.orderStatus === 'Processing' ? 'selected' : ''}>Processing</option>
          <option value="Packed" ${o.orderStatus === 'Packed' ? 'selected' : ''}>Packed</option>
          <option value="Shipped" ${o.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${o.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${o.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <button onclick="showOrderConfirmation(storeState.orders.find(ord => ord.id === '${o.id}'))" style="color:var(--color-secondary); font-weight:600; text-decoration:underline;">
          View Invoice
        </button>
      </td>
    </tr>
  `).join("");
}

function renderAdminCouponsTable() {
  const body = document.getElementById("adminCouponsTableBody");
  if (!body) return;

  body.innerHTML = storeState.coupons.map(c => `
    <tr>
      <td><strong style="color:var(--color-primary);">${c.code}</strong></td>
      <td>${c.discountPercent}%</td>
      <td>${formatPrice(c.minOrder)}</td>
      <td>${c.description}</td>
    </tr>
  `).join("");
}

function editProductModal(productId) {
  const p = storeState.products.find(item => item.id === productId);
  if (!p) return;

  document.getElementById("editProductId").value = p.id;
  document.getElementById("editProductTitle").value = p.title;
  document.getElementById("editProductCategory").value = p.category;
  document.getElementById("editProductFabric").value = p.fabric;
  document.getElementById("editProductPrice").value = p.price;
  document.getElementById("editProductOrigPrice").value = p.originalPrice || p.price + 400;
  document.getElementById("editProductImage").value = p.images[0];
  document.getElementById("editProductDesc").value = p.description;
  document.getElementById("editProductStock").value = p.stockCount;
  document.getElementById("editProductBadge").value = p.badge || "";

  document.getElementById("productEditModalTitle").textContent = `Edit "${p.title}"`;
  document.getElementById("productEditModal")?.classList.add("active");
  document.getElementById("productEditOverlay")?.classList.add("active");
}

function deleteProduct(productId) {
  if (confirm("Are you sure you want to remove this product from the catalog?")) {
    storeState.products = storeState.products.filter(p => p.id !== productId);
    saveStateToLocalStorage();
    renderStorefront();
    renderAdminProductsTable();
    updateAdminKPIs();
    showToast("Product deleted from catalog.");
  }
}

function updateOrderStatus(orderId, newStatus) {
  const order = storeState.orders.find(o => o.id === orderId);
  if (order) {
    order.orderStatus = newStatus;
    saveStateToLocalStorage();
    showToast(`Order #${orderId} status updated to ${newStatus}`);
  }
}

function downloadCSV(filename, text) {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Modal Helpers
function closeAllModals() {
  document.querySelectorAll(".modal-window").forEach(m => m.classList.remove("active"));
  document.querySelectorAll(".modal-overlay").forEach(o => o.classList.remove("active"));
}

function closeProductEditModal() {
  document.getElementById("productEditModal")?.classList.remove("active");
  document.getElementById("productEditOverlay")?.classList.remove("active");
}

function openSizeGuideModal() {
  closeAllModals();
  document.getElementById("sizeGuideModal")?.classList.add("active");
  document.getElementById("sizeGuideOverlay")?.classList.add("active");
}

// Toast Engine
function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--color-accent);"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
