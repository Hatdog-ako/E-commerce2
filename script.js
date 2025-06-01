const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}


// Utility: Get cart from localStorage
const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];

// Utility: Save cart to localStorage
const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

// Add product to cart
function addToCart(name, price, image) {
  const size = document.getElementById("sizeSelect").value;
  const quantity = parseInt(document.getElementById("quantityInput").value);

  if (size === "Select Size") return alert("Please select a size.");
  if (!quantity || quantity < 1) return alert("Please enter a valid quantity.");

  const cart = getCart();
  const index = cart.findIndex((item) => item.name === name && item.size === size);

  if (index > -1) cart[index].quantity += quantity;
  else cart.push({ name, price, image, size, quantity });

  saveCart(cart);
  alert("Added to cart!");

  document.getElementById("quantityInput").value = 1;
  document.getElementById("sizeSelect").value = "Select Size";
}

// Load and render cart
function loadCart() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");

  container.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="display:flex; align-items:center; gap:10px;">
        <img src="${item.image}" alt="${item.name}" style="width:50px;"/>${item.name}
      </td>
      <td>${item.size}</td>
      <td>&#8369;${item.price.toFixed(2)}</td>
      <td><input type="number" min="1" value="${item.quantity}" data-index="${index}" class="qty-input"/></td>
      <td>&#8369;${itemTotal.toFixed(2)}</td>
      <td><button class="remove-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button></td>
    `;
    container.appendChild(tr);
  });

  subtotalEl.textContent = subtotal.toFixed(2);
  attachCartListeners();
}

// Attach listeners to qty inputs and remove buttons
function attachCartListeners() {
  document.querySelectorAll(".qty-input").forEach((input) =>
    input.addEventListener("change", (e) => {
      let qty = parseInt(e.target.value);
      if (!qty || qty < 1) qty = 1;
      e.target.value = qty;
      updateQuantity(e.target.dataset.index, qty);
    })
  );

  document.querySelectorAll(".remove-btn").forEach((btn) =>
    btn.addEventListener("click", () => removeItem(btn.dataset.index))
  );
}

// Update item quantity
function updateQuantity(index, quantity) {
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity = quantity;
    saveCart(cart);
    loadCart();
  }
}

// Remove item from cart
function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  loadCart();
}

// Checkout handler
function checkout() {
  alert("Thank you for your purchase!");
  localStorage.removeItem("cart");
  loadCart();
}

// Initialize cart page
if (document.getElementById("cart-items")) {
  loadCart();
  document.getElementById("checkout-btn").addEventListener("click", checkout);
}
