let cartCounter = localStorage.getItem("cartCounter");
updateCartCounterDOM();
GetCatalogData();

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

async function GetCatalogData() {
  let response = await fetch(
    "https://raw.githubusercontent.com/maxgalun/classes/master/shop-data/data.json"
  );

  if (response.ok) {
    let json = await response.json();
    console.log(json);

    const bookPicture = document.querySelectorAll(".book__picture");
    const bookTitle = document.querySelectorAll(".book__title");

    for (let i = 0; i < json.length; i++) {
      bookPicture[i].src = json[i].image;
      bookPicture[i].alt = json[i].title;
      bookTitle[i].innerText = json[i].title;
    }
  } else {
    console.log("Ошибка HTTP: " + response.status);
  }
}
