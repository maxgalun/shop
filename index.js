fillCatalog();
fillCart();

async function fillCatalog() {
  const response = await fetch(
    "https://raw.githubusercontent.com/maxgalun/classes/master/shop-data/data.json"
  );
  catalog = await response.json();
  createNodeArrayCatalogListItem();
}

function createNodeArrayCatalogListItem() {
  let nodeArrayCatalogListItem = [];
  const catalogList = document.querySelector(".catalog__list");
  for (let i = 0; i < catalog.length; i++) {
    let nodeCatalogListItem = createNodeCatalogListItem();
    const bookPicture = nodeCatalogListItem.querySelector(".book__picture");
    const bookTitle = nodeCatalogListItem.querySelector(".book__title");
    const bookButton = nodeCatalogListItem.querySelector(".book__button");
    bookPicture.alt = catalog[i].title;
    bookPicture.src = catalog[i].image;
    bookTitle.innerText = catalog[i].title;
    bookButton.id = catalog[i].id;
    nodeArrayCatalogListItem.push(nodeCatalogListItem);
  }
  catalogList.append(...nodeArrayCatalogListItem);
}

function createNodeCatalogListItem() {
  const nodeCatalogListItem = document.createElement("li");
  const bookContent = document.createElement("div");
  const bookPicture = document.createElement("img");
  const bookTitle = document.createElement("div");
  const bookButton = document.createElement("button");
  nodeCatalogListItem.classList.add("catalog__list-item", "book");
  bookContent.classList.add("book__content");
  bookPicture.classList.add("book__picture");
  bookTitle.classList.add("book__title");
  bookButton.classList.add("book__button", "button");
  bookPicture.width = "153";
  bookPicture.height = "258";
  bookButton.innerText = "В корзину";
  bookButton.onclick = addGoodsItemtoCart;
  bookContent.append(bookPicture);
  bookContent.append(bookTitle);
  bookContent.append(bookButton);
  nodeCatalogListItem.append(bookContent);
  return nodeCatalogListItem;
}

function addGoodsItemtoCart(event) {
  updateCart(event.target.id);
  updateCartCounterDOM();
  setLocalStorageCart();
}

function setLocalStorageCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart(goodsId) {
  if (!cart) {
    cart = [];
  }
  cart.push(goodsId);
}
