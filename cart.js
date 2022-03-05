let catalogObjects;
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
  catalogObjects.forEach((element) => {
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
  catalogObjects = await response.json();
  const catalogList = document.querySelector(".catalog__list");
  catalogList.append(...createNodeArrayCatalogLI(catalogObjects));
}

function createNodeArrayCatalogLI(catalogObjects) {
  let catalog = [];
  for (let i = 0; i < catalogObjects.length; i++) {
    let book = createNodeCatalogLI();
    const bookPicture = book.querySelector(".book__picture");
    const bookTitle = book.querySelector(".book__title");
    const bookButton = book.querySelector(".book__button");
    bookPicture.alt = catalogObjects[i].title;
    bookPicture.src = catalogObjects[i].image;
    bookTitle.innerText = catalogObjects[i].title;
    bookButton.id = catalogObjects[i].id;
    catalog.push(book);
  }
  return catalog;
}

function createNodeCatalogLI() {
  const book = document.createElement("li");
  const bookContent = document.createElement("div");
  const bookPicture = document.createElement("img");
  const bookTitle = document.createElement("div");
  const bookButton = document.createElement("div");
  book.classList.add("catalog__list-item", "book");
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
  book.append(bookContent);
  return book;
}
