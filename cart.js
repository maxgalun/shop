let cartCounter = localStorage.getItem("cartCounter");
updateCartCounterDOM();
GetCatalog();

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

async function GetCatalog() {
  let response = await fetch(
    "https://raw.githubusercontent.com/maxgalun/classes/master/shop-data/data.json"
  );
  if (response.ok) {
    let json = await response.json();
    const catalogList = document.querySelector(".catalog__list");
    catalogList.append(...createNodeArrayCatalogLI(json));
  } else {
    console.log("Ошибка HTTP: " + response.status);
  }
}

function createNodeArrayCatalogLI(json) {
  let catalog = [];
  for (let i = 0; i < json.length; i++) {
    let book = document.createElement("li");
    let bookContent = document.createElement("div");
    let bookPicture = document.createElement("img");
    let bookTitle = document.createElement("div");
    let bookButton = document.createElement("div");
    book.classList.add("catalog__list-item", "book");
    bookContent.classList.add("book__content");
    bookPicture.classList.add("book__picture");
    bookPicture.width = "153";
    bookPicture.height = "258";
    bookPicture.alt = json[i].title;
    bookPicture.src = json[i].image;
    bookTitle.classList.add("book__title");
    bookTitle.innerText = json[i].title;
    bookButton.classList.add("book__button", "button");
    bookButton.innerText = "В корзину";
    bookButton.onclick = incrementCartCounter;
    bookContent.append(bookPicture);
    bookContent.append(bookTitle);
    bookContent.append(bookButton);
    book.append(bookContent);
    catalog.push(book);
  }
  return catalog;
}
