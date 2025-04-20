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

    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = "";
    }

    for (let i = 0; i < cart.length; i++) {
      let item = cart[i];
      total += item.price * item.qty;
      count += item.qty;

      if (cartItemsContainer) {
        let itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
          <p>${item.name} - ${item.price} LKR</p>
          <div class="quantity-controls">
            <button class="decrease" data-index="${i}">−</button>
            <span class="qty">${item.qty}</span>
            <button class="increase" data-index="${i}">+</button>
            <button class="remove-btn" data-index="${i}">Remove</button>
          </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
      }
    }

    if (cartCount) cartCount.textContent = count;
    if (cartTotal) cartTotal.textContent = "Total: " + total.toLocaleString() + " LKR";

    let increaseBtns = document.querySelectorAll(".increase");
    let decreaseBtns = document.querySelectorAll(".decrease");
    let removeBtns = document.querySelectorAll(".remove-btn");

    for (let btn of increaseBtns) {
      btn.onclick = function () {
        let index = btn.getAttribute("data-index");
        cart[index].qty += 1;
        saveCart();
      };
    }

    for (let btn of decreaseBtns) {
      btn.onclick = function () {
        let index = btn.getAttribute("data-index");
        if (cart[index].qty > 1) {
          cart[index].qty -= 1;
        } else {
          cart.splice(index, 1);
        }
        saveCart();
      };
    }

    for (let btn of removeBtns) {
      btn.onclick = function () {
        let index = btn.getAttribute("data-index");
        cart.splice(index, 1);
        saveCart();
      };
    }
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  }

  window.handleAddToCart = function (btn, name, price) {
    let card = btn.closest(".product-card") || btn.closest(".product-container");
    let qtyInput = card.querySelector(".qty-input");
    let qty = parseInt(qtyInput.value);

    let found = false;
    for (let item of cart) {
      if (item.name === name) {
        item.qty += qty;
        found = true;
        break;
      }
    }

    if (!found) {
      cart.push({ name: name, price: price, qty: qty });
    }

    saveCart();

    if (typeof Swal !== "undefined") {
      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: name + " x" + qty + " added.",
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  window.changeQty = function (btn, delta) {
    let input = btn.parentElement.querySelector(".qty-input");
    let qty = parseInt(input.value);
    qty += delta;
    if (qty < 1) qty = 1;
    input.value = qty;
  };

  if (addFavBtn) {
    addFavBtn.onclick = function () {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      for (let fav of favorites) {
        let found = false;
        for (let item of cart) {
          if (item.name === fav.name) {
            item.qty += 1;
            found = true;
            break;
          }
        }
        if (!found) {
          cart.push({ name: fav.name, price: fav.price, qty: 1 });
        }
      }
      saveCart();
    };
  }

  if (payBtn) {
    payBtn.onclick = function () {
      if (cart.length === 0) {
        if (typeof Swal !== "undefined") {
          Swal.fire({
            icon: "warning",
            title: "Cart is Empty",
            text: "Please add items before proceeding to payment.",
            confirmButtonText: "OK"
          });
        } else {
          alert("Cart is empty.");
        }
      } else {
        window.location.href = "payment.html";
      }
    };
  }

  updateCartDisplay();
});
