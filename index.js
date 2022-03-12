getCart();
createCatalogList();

async function createCatalogList() {
  const response = await fetch(
    "https://raw.githubusercontent.com/maxgalun/classes/master/shop-data/data.json"
  );
  let catalog = await response.json();
  createNodeArrayCatalogListItem(catalog);
}

function createNodeArrayCatalogListItem(catalog) {
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
    nodeCatalogListItem.dataset.catalogId = catalog[i].id;
    new CatalogItem(nodeCatalogListItem);
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
  bookButton.dataset.action = "incrementItem";
  bookContent.append(bookPicture, bookTitle, bookButton);
  nodeCatalogListItem.append(bookContent);
  return nodeCatalogListItem;
}
