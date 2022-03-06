let catalog;
let cart;

function fillCart() {
  cart = JSON.parse(localStorage.getItem("cart"));
  updateCartCounterDOM();
}

function updateCartCounterDOM() {
  if (cart) {
    document.querySelector(".cart__counter").innerText = cart.length;
  }
}
