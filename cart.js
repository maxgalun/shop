let cartCounter = localStorage.getItem("cartCounter");
updateCartCounterDOM();

function updateCartCounterDOM() {
  document.querySelector(".cart__counter").innerText = cartCounter;
}

function incrementCartCounter() {
  cartCounter++;
  updateCartCounterDOM();
  SetlocalStorageCartCounter();
}

function SetlocalStorageCartCounter() {
  localStorage.setItem("cartCounter", cartCounter);
}
