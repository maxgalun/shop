let cartCounter = localStorage.getItem("cartCounter");
updateCartCounterDOM();
getCatalog();

function updateCartCounterDOM() {
  document.querySelector(".cart__counter").innerText = cartCounter;
}

function incrementCartCounter() {
  cartCounter++;
  updateCartCounterDOM();
  setlocalStorageCartCounter();
}

function setlocalStorageCartCounter() {
  localStorage.setItem("cartCounter", cartCounter);
}

async function getCatalog() {
  const response = await fetch(
    "https://raw.githubusercontent.com/maxgalun/classes/master/shop-data/data.json"
  );
  const json = await response.json();
  const catalogList = document.querySelector(".catalog__list");
  catalogList.append(...createNodeArrayCatalogLI(json));
}

function createNodeArrayCatalogLI(json) {
  let catalog = [];
  for (let i = 0; i < json.length; i++) {
    let book = createNodeCatalogLI();
    const bookPicture = book.querySelector(".book__picture");
    const bookTitle = book.querySelector(".book__title");
    bookPicture.alt = json[i].title;
    bookPicture.src = json[i].image;
    bookTitle.innerText = json[i].title;
    catalog.push(book);
  }
  return catalog;
}

function createNodeCatalogLI() {
  const bookPictureWidth = "153";
  const bookPictureHeight = "258";
  const bookButtonText = "В корзину";
  const bookButtonOnClick = incrementCartCounter;
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
  bookPicture.width = bookPictureWidth;
  bookPicture.height = bookPictureHeight;
  bookButton.innerText = bookButtonText;
  bookButton.onclick = bookButtonOnClick;
  bookContent.append(bookPicture);
  bookContent.append(bookTitle);
  bookContent.append(bookButton);
  book.append(bookContent);
  return book;
}
