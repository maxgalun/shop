let catalog;
getCatalog();
let cart = JSON.parse(localStorage.getItem("cart"));
updateCartCounterDOM();

function updateCartCounterDOM() {
  if (cart) {
    document.querySelector(".cart__counter").innerText = cart.length;
  }
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
  catalog.forEach((element) => {
    if (element.id == goodsId) {
      if (!cart) {
        cart = [];
      }
      cart.push(element);
    }
  });
}

async function getCatalog() {
  const response = await fetch(
    "https://raw.githubusercontent.com/maxgalun/classes/master/shop-data/data.json"
  );
  catalog = await response.json();
  const catalogList = document.querySelector(".catalog__list");
  catalogList.append(...createNodeArrayCatalogLI(catalog));
}

function createNodeArrayCatalogLI(catalog) {
  let nodeArrayCatalogLI = [];
  for (let i = 0; i < catalog.length; i++) {
    let nodeCatalogLI = createNodeCatalogLI();
    const bookPicture = nodeCatalogLI.querySelector(".book__picture");
    const bookTitle = nodeCatalogLI.querySelector(".book__title");
    const bookButton = nodeCatalogLI.querySelector(".book__button");
    bookPicture.alt = catalog[i].title;
    bookPicture.src = catalog[i].image;
    bookTitle.innerText = catalog[i].title;
    bookButton.id = catalog[i].id;
    nodeArrayCatalogLI.push(nodeCatalogLI);
  }
  return nodeArrayCatalogLI;
}

function createNodeCatalogLI() {
  const nodeCatalogLI = document.createElement("li");
  const bookContent = document.createElement("div");
  const bookPicture = document.createElement("img");
  const bookTitle = document.createElement("div");
  const bookButton = document.createElement("div");
  nodeCatalogLI.classList.add("catalog__list-item", "book");
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
  nodeCatalogLI.append(bookContent);
  return nodeCatalogLI;
}
