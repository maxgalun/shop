let cart;

function getCart() {
  cart = JSON.parse(localStorage.getItem("cart"));
  if (!cart) cart = [];
  updateCartCounterDOM();
}

function updateCartCounterDOM() {
  if (cart.length) {
    document.querySelector(".cart__counter").innerText = cart.length;
  }
}

function setLocalStorageCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

class CatalogItem {
  constructor(element) {
    this.element = element;
    this.amountCounterValue = element.querySelector(
      'form[name="amountCounter"]'
    ).elements.amountCounterValue;
    console.log(this.amountCounter);
    this.element.onclick = this.onClickHandler.bind(this);
  }

  onClickHandler(event) {
    let action = event.target.dataset.action;

    if (action) {
      this[action](event);
    }
  }

  decrementAmountCounter(event) {
    if (this.amountCounterValue)
      if (this.amountCounterValue.value > 1) {
        this.amountCounterValue.value--;
        cart.splice(cart.lastIndexOf(event.currentTarget.dataset.catalogId), 1);
        setLocalStorageCart();
        updateCartCounterDOM();
      }
  }

  incrementAmountCounter(event) {
    cart.push(event.currentTarget.dataset.catalogId);
    if (this.amountCounterValue) this.amountCounterValue.value++;
    setLocalStorageCart();
    updateCartCounterDOM();
  }

  removeItem(event) {
    if (confirm("Удалить товар из корзины?")) {
      this.element.remove();
      while (cart.lastIndexOf(event.currentTarget.dataset.catalogId) > -1) {
        cart.splice(cart.lastIndexOf(event.currentTarget.dataset.catalogId), 1);
      }

      setLocalStorageCart();
      updateCartCounterDOM();
    }
  }
}
