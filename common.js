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
      Cart.instance.updateCartCounterDOM();
      Cart.instance.setLocalStorageCart();
    });

    this.on("checkCart", () => {
      Cart.instance.checkCartIsEmpty();
    });

    element.onclick = this.onClickHandler.bind(this);
  }

  onClickHandler(event) {
    let action = event.target.dataset.action;
    if (action) {
      this[action](event);
    }
  }

  incrementAmountCounter(event) {
    if (this.amountCounterValue) this.amountCounterValue.value++;
    Cart.instance.addCatalogItemInCart(event.currentTarget.dataset.catalogId);
    this.trigger("updateCart");
  }

  decrementAmountCounter(event) {
    if (this.amountCounterValue) {
      if (this.amountCounterValue.value > 1) {
        this.amountCounterValue.value--;
        Cart.instance.removeCatalogItemFromCart(
          event.currentTarget.dataset.catalogId
        );
        this.trigger("updateCart");
      }
    }
  }

  removeItem(event) {
    if (confirm("Удалить товар из корзины?")) {
      this.element.remove();
      Cart.instance.removeAllCatalogItemFromCart(
        event.currentTarget.dataset.catalogId
      );
      this.trigger("updateCart");
      this.trigger("checkCart");
    }
  }
}

class CatalogList {
  constructor(element) {
    if (CatalogList.exists) {
      return CatalogList.instance;
    }
    CatalogList.instance = this;
    CatalogList.exists = true;
    this.catalog = [];
    this.catalogList = element;
  }

  async getCatalog() {
    const response = await fetch(
      "https://raw.githubusercontent.com/maxgalun/classes/master/shop-data/data.json"
    );
    this.catalog = await response.json();
    this.createNodeArrayCatalogListItem();
  }

  createNodeArrayCatalogListItem() {
    let nodeArrayCatalogListItem = [];
    for (let i = 0; i < this.catalog.length; i++) {
      let nodeCatalogListItem = new NodeCatalogListItem()
        .fillNodeElements()
        .createNodeVirtualTree();
      const bookPicture = nodeCatalogListItem.querySelector(".book__picture");
      const bookTitle = nodeCatalogListItem.querySelector(".book__title");
      bookPicture.alt = this.catalog[i].title;
      bookPicture.src = this.catalog[i].image;
      bookTitle.innerText = this.catalog[i].title;
      nodeCatalogListItem.dataset.catalogId = this.catalog[i].id;
      nodeArrayCatalogListItem.push(nodeCatalogListItem);
      new CatalogItem(nodeCatalogListItem);
    }
    this.catalogList.append(...nodeArrayCatalogListItem);
  }
}

class NodeCatalogListItem {
  constructor() {
    this.nodeCatalogListItem = document.createElement("li");
    this.bookContent = document.createElement("div");
    this.bookPicture = document.createElement("img");
    this.bookTitle = document.createElement("div");
    this.bookButton = document.createElement("button");
  }

  fillNodeElements() {
    this.nodeCatalogListItem.classList.add("catalog__list-item", "book");
    this.bookContent.classList.add("book__content");
    this.bookPicture.classList.add("book__picture");
    this.bookTitle.classList.add("book__title");
    this.bookButton.classList.add("book__button");
    this.bookPicture.width = "153";
    this.bookPicture.height = "258";
    this.bookButton.type = "button";
    this.bookButton.name = "addToCartButton";
    this.bookButton.innerText = "В корзину";
    this.bookButton.dataset.action = "incrementAmountCounter";
    return this;
  }

  createNodeVirtualTree() {
    this.bookContent.append(this.bookPicture, this.bookTitle, this.bookButton);
    this.nodeCatalogListItem.append(this.bookContent);
    return this.nodeCatalogListItem;
  }
}

class Cart {
  constructor(element) {
    if (Cart.exists) {
      return Cart.instance;
    }
    Cart.instance = this;
    Cart.exists = true;
    this.element = element;
    this.cartCounter = element.querySelector(".cart__counter");
    this.cartArray = JSON.parse(localStorage.getItem("cart"));
    if (!this.cartArray) this.cartArray = [];
    this.updateCartCounterDOM();
  }

  cartTransform() {
    let result = [];
    for (let i = 0; i < Cart.instance.cartArray.length; i++) {
      let index = result.findIndex(
        (item) => item.id == Cart.instance.cartArray[i]
      );
      if (index > -1) {
        result[index].amount++;
      } else {
        let item = {};
        item.id = Cart.instance.cartArray[i];
        item.amount = 1;
        result.push(item);
      }
    }
    return result;
  }

  addCatalogItemInCart(catalogId) {
    this.cartArray.push(catalogId);
  }

  removeCatalogItemFromCart(catalogId) {
    this.cartArray.splice(this.cartArray.lastIndexOf(catalogId), 1);
  }

  removeAllCatalogItemFromCart(catalogId) {
    while (this.cartArray.lastIndexOf(catalogId) > -1) {
      this.cartArray.splice(this.cartArray.lastIndexOf(catalogId), 1);
    }
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

class GoodsCatalogList {
  constructor(element) {
    if (GoodsCatalogList.exists) {
      return GoodsCatalogList.instance;
    }
    GoodsCatalogList.instance = this;
    GoodsCatalogList.exists = true;
    this.cartList = element;
    this.catalog = [];
    this.goods = [];
  }

  async getCatalog() {
    this.goods = Cart.instance.cartTransform();
    const response = await fetch(
      "https://raw.githubusercontent.com/maxgalun/classes/master/shop-data/data.json"
    );
    this.catalog = await response.json();
    this.createNodeArrayCartListItem();
  }

  createNodeArrayCartListItem() {
    let nodeArrayCartListItem = [];
    for (let i = 0; i < this.goods.length; i++) {
      let nodeCartListItem = new NodeCartListItem()
        .fillNodeElements()
        .createNodeVirtualTree();
      const goodsPicture = nodeCartListItem.querySelector(".goods__picture");
      const goodsTitle = nodeCartListItem.querySelector(".goods__title");
      const goodsAmount = nodeCartListItem.querySelector(
        ".amount-counter__value"
      );
      let catalogItem = this.catalog.find(
        (item) => item.id == this.goods[i].id
      );
      goodsPicture.alt = catalogItem.title;
      goodsPicture.src = catalogItem.image;
      goodsTitle.innerText = catalogItem.title;
      nodeCartListItem.dataset.catalogId = catalogItem.id;
      goodsAmount.value = this.goods[i].amount;
      nodeArrayCartListItem.push(nodeCartListItem);
      new CatalogItem(nodeCartListItem);
    }
    this.cartList.append(...nodeArrayCartListItem);
  }
}

class NodeCartListItem {
  constructor() {
    this.nodeCartListItem = document.createElement("li");
    this.goodsContent = document.createElement("div");
    this.goodsPicture = document.createElement("img");
    this.goodsTitle = document.createElement("div");
    this.goodsAmount = document.createElement("div");
    this.amountContent = document.createElement("div");
    this.amountIncrement = document.createElement("button");
    this.amountCounterValue = document.createElement("input");
    this.amountDecrement = document.createElement("button");
    this.goodsDeleteButton = document.createElement("button");
  }

  fillNodeElements() {
    this.amountCounterValue.type = "text";
    this.amountCounterValue.disabled = "disabled";
    this.amountCounterValue.name = "amountCounterValue";
    this.nodeCartListItem.classList.add("cart__list-item", "goods");
    this.goodsContent.classList.add("goods__content");
    this.goodsPicture.classList.add("goods__picture");
    this.goodsTitle.classList.add("goods__title");
    this.goodsAmount.classList.add("goods__amount", "amount-counter");
    this.amountContent.classList.add("amount-counter__content");
    this.amountDecrement.classList.add("amount-counter__control");
    this.amountDecrement.dataset.action = "decrementAmountCounter";
    this.amountCounterValue.classList.add("amount-counter__value");
    this.amountIncrement.classList.add("amount-counter__control");
    this.amountIncrement.dataset.action = "incrementAmountCounter";
    this.goodsDeleteButton.classList.add(
      "amount-counter__control",
      "goods__delete-button"
    );
    this.goodsPicture.width = "153";
    this.goodsPicture.height = "258";
    this.amountDecrement.innerText = "–";
    this.amountIncrement.innerText = "+";
    this.goodsDeleteButton.type = "button";
    this.goodsDeleteButton.name = "удалить товар";
    this.goodsDeleteButton.dataset.action = "removeItem";
    this.goodsDeleteButton.innerText = "×";
    return this;
  }

  createNodeVirtualTree() {
    this.amountContent.append(
      this.amountDecrement,
      this.amountCounterValue,
      this.amountIncrement
    );
    this.goodsAmount.append(this.amountContent);
    this.goodsContent.append(
      this.goodsPicture,
      this.goodsTitle,
      this.goodsAmount,
      this.goodsDeleteButton
    );
    this.nodeCartListItem.append(this.goodsContent);
    return this.nodeCartListItem;
  }
}

Object.assign(CatalogItem.prototype, eventMixin);
Object.assign(Cart.prototype, eventMixin);
