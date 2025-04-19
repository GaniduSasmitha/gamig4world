document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCount = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const addFavBtn = document.getElementById("add-fav-to-cart");
  const payBtn = document.getElementById("pay-online-btn");

  function updateCartDisplay() {
    let total = 0;
    let count = 0;

    if (cartItemsContainer) cartItemsContainer.innerHTML = "";

    cart.forEach((item, index) => {
      total += item.price * item.qty;
      count += item.qty;

      if (cartItemsContainer) {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
          <p>${item.name} - ${item.price} LKR</p>
          <div class="quantity-controls">
            <button class="decrease" data-index="${index}">−</button>
            <span class="qty">${item.qty}</span>
            <button class="increase" data-index="${index}">+</button>
            <button class="remove-btn" data-index="${index}">Remove</button>
          </div>
        `;
        cartItemsContainer.appendChild(cartItem);
      }
    });

    //  Always update count display if element exists
    if (cartCount) cartCount.textContent = count;
    if (cartTotal) cartTotal.textContent = `Total: ${total.toLocaleString()} LKR`;

    // Event listeners...
    document.querySelectorAll(".increase").forEach(btn => {
      btn.addEventListener("click", e => {
        const index = e.target.getAttribute("data-index");
        cart[index].qty += 1;
        saveAndUpdate();
      });
    });

    document.querySelectorAll(".decrease").forEach(btn => {
      btn.addEventListener("click", e => {
        const index = e.target.getAttribute("data-index");
        if (cart[index].qty > 1) {
          cart[index].qty -= 1;
        } else {
          cart.splice(index, 1);
        }
        saveAndUpdate();
      });
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const index = e.target.getAttribute("data-index");
        cart.splice(index, 1);
        saveAndUpdate();
      });
    });
  }

  function saveAndUpdate() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay(); // Also updates count
  }

  // Same product logic...
  window.handleAddToCart = function (btn, name, price) {
    const card = btn.closest(".product-card") || btn.closest(".product-container");
    const qtyInput = card.querySelector(".qty-input");
    const qty = parseInt(qtyInput.value);

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ name, price, qty });
    }

    saveAndUpdate();

    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: `${name} x${qty} added.`,
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  window.changeQty = function (btn, delta) {
    const input = btn.parentElement.querySelector(".qty-input");
    let qty = parseInt(input.value);
    qty += delta;
    if (qty < 1) qty = 1;
    input.value = qty;
  };

  if (addFavBtn) {
    addFavBtn.addEventListener("click", () => {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      favorites.forEach(fav => {
        let existing = cart.find(item => item.name === fav.name);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ name: fav.name, price: fav.price, qty: 1 });
        }
      });
      saveAndUpdate();
    });
  }

  if (payBtn) {
    payBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'warning',
            title: 'Cart is Empty',
            text: 'Please add items before proceeding to payment.',
            confirmButtonText: 'OK'
          });
        } else {
          alert("Cart is empty.");
        }
        return;
      }
      window.location.href = "payment.html";
    });
  }

  // This ensures cart count is updated immediately
  updateCartDisplay();
});
