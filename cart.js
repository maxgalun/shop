getCart();
createGoodsCatalogList();
checkCartIsEmpty();

async function createGoodsCatalogList() {
  let goods = cartTransform();
  const response = await fetch(
    "https://raw.githubusercontent.com/maxgalun/classes/master/shop-data/data.json"
  );
  let catalog = await response.json();
  createNodeArrayCartListItem(goods, catalog);
}

function cartTransform() {
  let result = [];
  for (let i = 0; i < cart.length; i++) {
    let index = result.findIndex((item) => item.id == cart[i]);
    if (index > -1) {
      result[index].amount++;
    } else {
      let item = {};
      item.id = cart[i];
      item.amount = 1;
      result.push(item);
    }
  }
  return result;
}

function createNodeArrayCartListItem(goods, catalog) {
  let nodeArrayCartListItem = [];
  const cartList = document.querySelector(".cart__list");
  for (let i = 0; i < goods.length; i++) {
    let nodeCartListItem = createNodeCartListItem();
    const goodsPicture = nodeCartListItem.querySelector(".goods__picture");
    const goodsTitle = nodeCartListItem.querySelector(".goods__title");
    const goodsAmount = nodeCartListItem.querySelector(
      ".amount-counter__value"
    );
    let catalogItem = catalog.find((item) => item.id == goods[i].id);
    goodsPicture.alt = catalogItem.title;
    goodsPicture.src = catalogItem.image;
    goodsTitle.innerText = catalogItem.title;
    nodeCartListItem.dataset.catalogId = catalogItem.id;
    goodsAmount.value = goods[i].amount;
    new CatalogItem(nodeCartListItem);
    nodeArrayCartListItem.push(nodeCartListItem);
  }
  if (nodeArrayCartListItem.length == 0)
    nodeArrayCartListItem.push(createNodeEmptyCart());

  cartList.append(...nodeArrayCartListItem);
}

function createNodeCartListItem() {
  const nodeCartListItem = document.createElement("li");
  const goodsContent = document.createElement("div");
  const goodsPicture = document.createElement("img");
  const goodsTitle = document.createElement("div");
  const goodsAmount = document.createElement("div");
  const amountContent = document.createElement("div");
  const amountIncrement = document.createElement("button");
  const amountCounterValue = document.createElement("input");
  amountCounterValue.type = "text";
  amountCounterValue.disabled = "disabled";
  amountCounterValue.name = "amountCounterValue";
  const amountDecrement = document.createElement("button");
  const goodsDeleteButton = document.createElement("button");
  const goodsDeleteIcon = document.createElement("img");
  nodeCartListItem.classList.add("cart__list-item", "goods");
  goodsContent.classList.add("goods__content");
  goodsPicture.classList.add("goods__picture");
  goodsTitle.classList.add("goods__title");
  goodsAmount.classList.add("goods__amount", "amount-counter");
  amountContent.classList.add("amount-counter__content");
  amountDecrement.classList.add("amount-counter__control");
  amountDecrement.dataset.action = "decrementAmountCounter";
  amountCounterValue.classList.add("amount-counter__value");
  amountIncrement.classList.add("amount-counter__control");
  amountIncrement.dataset.action = "incrementAmountCounter";
  goodsDeleteButton.classList.add("goods__delete-button");
  goodsDeleteIcon.classList.add("goods__delete-icon");
  goodsPicture.width = "153";
  goodsPicture.height = "258";
  amountDecrement.innerText = "–";
  amountIncrement.innerText = "+";
  goodsDeleteButton.type = "button";
  goodsDeleteButton.name = "удалить товар";
  goodsDeleteButton.dataset.action = "removeItem";
  goodsDeleteIcon.width = "30";
  goodsDeleteIcon.height = "30";
  goodsDeleteIcon.src = "img/delete-button.svg";
  goodsDeleteIcon.alt = "мусорная корзина";
  goodsDeleteIcon.dataset.action = "removeItem";
  goodsDeleteButton.append(goodsDeleteIcon);
  amountContent.append(amountDecrement, amountCounterValue, amountIncrement);
  goodsAmount.append(amountContent);
  goodsContent.append(goodsPicture, goodsTitle, goodsAmount, goodsDeleteButton);
  nodeCartListItem.append(goodsContent);
  return nodeCartListItem;
}

function createNodeEmptyCart() {
  const nodeEmptyCart = document.createElement("li");
  nodeEmptyCart.classList.add("cart__list-item", "empty-cart");
  nodeEmptyCart.innerHTML = "Корзина пуста";
  return nodeEmptyCart;
}

function checkCartIsEmpty() {
  if (cart.length == 0) {
    document.querySelector(".empty-cart").classList.add("empty-cart--show");
  } else {
    document.querySelector(".empty-cart").classList.remove("empty-cart--show");
  }
}
