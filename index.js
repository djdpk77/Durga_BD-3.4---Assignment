const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

let cart = [
  { productId: 1, name: 'Laptop', price: 50000, quantity: 1 },
  { productId: 2, name: 'Mobile', price: 20000, quantity: 2 },
];

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

//Function to add an item to cart
function addItemtoCart(productId, name, price, quantity) {
  cart.push({
    productId: productId,
    name: name,
    price: price,
    quantity: quantity,
  });
}

//Endpoint 1: Add an Item to the Cart
app.get('/cart/add', (req, res) => {
  let productId = parseInt(req.query.productId);
  let name = req.query.name;
  let price = parseInt(req.query.price);
  let quantity = parseInt(req.query.quantity);

  addItemtoCart(productId, name, price, quantity);

  res.json({ cartItems: cart });
});

//Function to update the quantity of an item in the cart based on the product ID
function updateQuantityByProductId(cart, productId, quantity) {
  for (i = 0; i < cart.length; i++) {
    if (cart[i].productId === productId) {
      cart[i].quantity = quantity;
      break;
    }
  }

  return cart;
}

//Endpoint 2: Edit Quantity of an Item in the Cart
app.get('/cart/edit', (req, res) => {
  let productId = parseInt(req.query.productId);
  let quantity = parseInt(req.query.quantity);

  cart = updateQuantityByProductId(cart, productId, quantity);

  res.json({ cartItems: cart });
});

//Function to remove an item from the cart based on the product ID
function removeItemByProductId(ele, productId) {
  return ele.productId != productId;
}

//Endpoint 3: Delete an Item from the Cart
app.get('/cart/delete', (req, res) => {
  let productId = parseInt(req.query.productId);

  cart = cart.filter((ele) => removeItemByProductId(ele, productId));

  res.json({ cartItems: cart });
});

//Endpoint 4: Read Items in the Cart
app.get('/cart', (req, res) => {
  res.json({ cartItems: cart });
});

//Function to calculate the total quantity of items in the cart
function calculateTotalQuantity(cart) {
  let sum = 0;
  for (i = 0; i < cart.length; i++) {
    sum = sum + cart[i].quantity;
  }
  return sum;
}

//Endpoint 5: Calculate Total Quantity of Items in the Cart
app.get('/cart/total-quantity', (req, res) => {
  let totalQuantity = calculateTotalQuantity(cart);

  res.json({ totalQuantity: totalQuantity });
});

//Function to calculate the total price of items in the cart
function calculateTotalPrice(cart) {
  let totalPrice = 0;
  for (i = 0; i < cart.length; i++) {
    totalPrice = totalPrice + cart[i].price * cart[i].quantity;
  }

  return totalPrice;
}

//Endpoint 6: Calculate Total Price of Items in the Cart
app.get('/cart/total-price', (req, res) => {
  let totalPrice = calculateTotalPrice(cart);

  res.json({ totalPrice: totalPrice });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
