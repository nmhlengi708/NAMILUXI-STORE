
"use strict";

// NAMILUXE STOREFRONT

const products = [
  {
    id: 1,
    name: "Silky Straight Wig",
    category: "Wigs",
    price: 1850,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700",
    description: "Elegant silky straight finish."
  },
  {
    id: 2,
    name: "Body Wave Wig",
    category: "Wigs",
    price: 2200,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700",
    description: "Beautiful flowing body waves."
  },
  {
    id: 3,
    name: "Brazilian Hair Bundles",
    category: "Bundles",
    price: 1450,
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=700",
    description: "Premium-looking Brazilian bundles."
  },
  {
    id: 4,
    name: "Deep Wave Bundles",
    category: "Bundles",
    price: 1650,
    image: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=700",
    description: "Beautiful deep wave texture."
  },
  {
    id: 5,
    name: "HD Lace Closure",
    category: "Closures",
    price: 950,
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=700",
    description: "Natural-looking lace closure."
  },
  {
    id: 6,
    name: "HD Lace Frontal",
    category: "Closures",
    price: 1250,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700",
    description: "Premium lace frontal finish."
  }
];

let cart = JSON.parse(localStorage.getItem("namiluxe_cart") || "[]");
let accountMode = "login";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

function money(amount) {
  return "R" + amount.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function notify(message) {
  const notification = document.getElementById("notification");

  notification.textContent = message;
  notification.style.display = "block";

  clearTimeout(notify.timer);

  notify.timer = setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// PRODUCT DISPLAY

function displayProducts() {
  const search = searchInput.value.toLowerCase().trim();
  const category = categoryFilter.value;

  const filtered = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search);

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = "<p>No products found. Try another search.</p>";
    return;
  }

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <img
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
        onerror="this.style.display='none'"
      >
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>${money(product.price)}</strong></p>
      <button onclick="addToCart(${product.id})">
        ADD TO BAG
      </button>
    </article>
  `).join("");
}

searchInput.addEventListener("input", displayProducts);
categoryFilter.addEventListener("change", displayProducts);

// CATEGORY SHORTCUTS

document.querySelectorAll("[data-category]").forEach(link => {
  link.addEventListener("click", () => {
    categoryFilter.value = link.dataset.category;
    displayProducts();
  });
});

// SHOPPING BAG

function saveCart() {
  localStorage.setItem("namiluxe_cart", JSON.stringify(cart));
  updateCart();
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);

  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: product.id,
      quantity: 1
    });
  }

  saveCart();
  notify(product.name + " added to your bag.");
}

function updateCart() {
  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  cartCount.textContent = totalQuantity;

  let subtotal = 0;

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);

    if (!product) return "";

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="cart-row">
        <div>
          <strong>${product.name}</strong>
          <p>${money(product.price)} × ${item.quantity}</p>
        </div>
        <div>
          <strong>${money(itemTotal)}</strong>
          <button onclick="changeQuantity(${product.id}, -1)">−</button>
          <button onclick="changeQuantity(${product.id}, 1)">+</button>
          <button onclick="removeFromCart(${product.id})">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your shopping bag is empty.</p>";
  }

  cartTotal.textContent = money(subtotal);
}

function changeQuantity(productId, amount) {
  const item = cart.find(p => p.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== productId);
  }

  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  notify("Product removed from your bag.");
}

// MODALS

const accountModal = document.getElementById("accountModal");
const cartModal = document.getElementById("cartModal");

document.getElementById("accountBtn").addEventListener("click", () => {
  accountModal.hidden = false;
});

document.getElementById("cartBtn").addEventListener("click", () => {
  cartModal.hidden = false;
  updateCart();
});

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => {
    accountModal.hidden = true;
    cartModal.hidden = true;
  });
});

[accountModal, cartModal].forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) {
      modal.hidden = true;
    }
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    accountModal.hidden = true;
    cartModal.hidden = true;
  }
});

// LOGIN AND SIGN-UP DEMO

const accountForm = document.getElementById("accountForm");
const customerName = document.getElementById("customerName");
const customerEmail = document.getElementById("customerEmail");
const customerPassword = document.getElementById("customerPassword");
const accountSubmit = document.getElementById("accountSubmit");
const accountMessage = document.getElementById("accountMessage");

function setAccountMode(mode) {
  accountMode = mode;

  customerName.hidden = mode === "login";
  customerName.required = mode === "signup";

  accountSubmit.textContent =
    mode === "login" ? "Login" : "Create Account";

  accountMessage.textContent = "";
}

document.getElementById("loginTab").addEventListener("click", () => {
  setAccountMode("login");
});

document.getElementById("signupTab").addEventListener("click", () => {
  setAccountMode("signup");
});

accountForm.addEventListener("submit", event => {
  event.preventDefault();

  const email = customerEmail.value.trim().toLowerCase();
  const password = customerPassword.value;

  if (password.length < 8) {
    accountMessage.textContent =
      "Password must contain at least 8 characters.";
    return;
  }

  let users = JSON.parse(
    localStorage.getItem("namiluxe_demo_users") || "[]"
  );

  if (accountMode === "signup") {
    if (users.some(user => user.email === email)) {
      accountMessage.textContent =
        "An account with this email already exists.";
      return;
    }

    users.push({
      name: customerName.value.trim(),
      email,
      password
    });

    localStorage.setItem(
      "namiluxe_demo_users",
      JSON.stringify(users)
    );

    accountMessage.textContent =
      "Demo account created successfully. You can now log in.";

    setAccountMode("login");
    return;
  }

  const user = users.find(
    item => item.email === email && item.password === password
  );

  if (!user) {
    accountMessage.textContent =
      "Incorrect email or password.";
    return;
  }

  accountMessage.textContent =
    "Welcome back, " + user.name + "!";

  notify("Welcome to NamiLuxe!");

  setTimeout(() => {
    accountModal.hidden = true;
  }, 1200);
});

// CHECKOUT PLACEHOLDER

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    notify("Your shopping bag is empty.");
    return;
  }

  notify("Checkout will be activated when payments are connected.");
});

// NEWSLETTER

document.getElementById("newsletterForm").addEventListener(
  "submit",
  event => {
    event.preventDefault();

    notify("Thank you for your interest in NamiLuxe!");

    event.target.reset();
  }
);

// FOOTER YEAR

document.getElementById("year").textContent =
  new Date().getFullYear();

// INITIALISE WEBSITE

setAccountMode("login");
displayProducts();
updateCart();

