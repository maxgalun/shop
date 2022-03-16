const cart = new Cart(document.querySelector(".cart"));
createGoodsCatalogList();

async function createGoodsCatalogList() {
  let goods = cartTransform();
  console.log(goods);
  const response = await fetch(
    "https://raw.githubusercontent.com/maxgalun/classes/master/shop-data/data.json"
  );
  let catalog = await response.json();
  createNodeArrayCartListItem(goods, catalog);
}

function cartTransform() {
  let result = [];
  for (let i = 0; i < cart.cartArray.length; i++) {
    let index = result.findIndex((item) => item.id == cart.cartArray[i]);
    if (index > -1) {
      result[index].amount++;
    } else {
      let item = {};
      item.id = cart.cartArray[i];
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
  goodsDeleteButton.classList.add(
    "amount-counter__control",
    "goods__delete-button"
  );
  goodsPicture.width = "153";
  goodsPicture.height = "258";
  amountDecrement.innerText = "–";
  amountIncrement.innerText = "+";
  goodsDeleteButton.type = "button";
  goodsDeleteButton.name = "удалить товар";
  goodsDeleteButton.dataset.action = "removeItem";
  goodsDeleteButton.innerText = "×";
  amountContent.append(amountDecrement, amountCounterValue, amountIncrement);
  goodsAmount.append(amountContent);
  goodsContent.append(goodsPicture, goodsTitle, goodsAmount, goodsDeleteButton);
  nodeCartListItem.append(goodsContent);
  return nodeCartListItem;
}
