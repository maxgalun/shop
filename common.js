window.addEventListener("storage", (event) => {
  location.reload();
});

let eventMixin = {
  /**
   * Подписаться на событие, использование:
   * menu.on('select', function(item) { ... }
   */
  on(eventName, handler) {
    if (!this._eventHandlers) this._eventHandlers = {};
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = [];
    }
    this._eventHandlers[eventName].push(handler);
  },

  /**
   * Отменить подписку, использование:
   * menu.off('select', handler)
   */
  off(eventName, handler) {
    let handlers = this._eventHandlers && this._eventHandlers[eventName];
    if (!handlers) return;
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1);
      }
    }
  },

  /**
   * Сгенерировать событие с указанным именем и данными
   * this.trigger('select', data1, data2);
   */
  trigger(eventName, ...args) {
    if (!this._eventHandlers || !this._eventHandlers[eventName]) {
      return; // обработчиков для этого события нет
    }

    // вызовем обработчики
    this._eventHandlers[eventName].forEach((handler) =>
      handler.apply(this, args)
    );
  },
};

class CatalogItem {
  constructor(element) {
    this.element = element;
    this.amountCounterValue = element.querySelector(
      "input[name = amountCounterValue]"
    );
    this.on("updateCart", () => {
      cart.updateCartCounterDOM();
      cart.setLocalStorageCart();
    });

    this.on("emptyCart", () => {
      cart.checkCartIsEmpty();
    });

    element.onclick = this.onClickHandler.bind(this);
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
        cart.cartArray.splice(
          cart.cartArray.lastIndexOf(event.currentTarget.dataset.catalogId),
          1
        );
        this.updateCart();
      }
  }

  incrementAmountCounter(event) {
    cart.cartArray.push(event.currentTarget.dataset.catalogId);
    if (this.amountCounterValue) this.amountCounterValue.value++;
    this.updateCart();
  }

  removeItem(event) {
    if (confirm("Удалить товар из корзины?")) {
      this.element.remove();
      while (
        cart.cartArray.lastIndexOf(event.currentTarget.dataset.catalogId) > -1
      ) {
        cart.cartArray.splice(
          cart.cartArray.lastIndexOf(event.currentTarget.dataset.catalogId),
          1
        );
      }
      this.updateCart();
      this.emptyCart();
    }
  }

  updateCart() {
    this.trigger("updateCart");
  }

  emptyCart() {
    this.trigger("emptyCart");
  }
}

class Cart {
  constructor(element) {
    this.element = element;
    this.cartCounter = element.querySelector(".cart__counter");
    this.cartArray = JSON.parse(localStorage.getItem("cart"));
    if (!this.cartArray) this.cartArray = [];
    this.updateCartCounterDOM();
  }

  updateCartCounterDOM() {
    if (this.cartArray.length == 0) {
      this.cartCounter.innerText = null;
      return;
    }
    this.cartCounter.innerText = this.cartArray.length;
  }

  setLocalStorageCart() {
    localStorage.setItem("cart", JSON.stringify(this.cartArray));
  }

  checkCartIsEmpty() {
    if (this.cartArray.length == 0) {
      document.querySelector(".empty-cart").classList.add("empty-cart--show");
    } else {
      document
        .querySelector(".empty-cart")
        .classList.remove("empty-cart--show");
    }
  }
}

Object.assign(CatalogItem.prototype, eventMixin);
Object.assign(Cart.prototype, eventMixin);
