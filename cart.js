fillCart();
let goods = cartTransform();
fillGoodsCatalog();

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

console.log(goods);

async function fillGoodsCatalog() {
  const response = await fetch(
    "https://raw.githubusercontent.com/maxgalun/classes/master/shop-data/data.json"
  );
  catalog = await response.json();
  console.log(catalog);
}
