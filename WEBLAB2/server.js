const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./product.model');
const port = process.env.PORT || 8081;

app.use(cors());
app.use(bodyParser.json());

require('./database'); // Import the database connection setup

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to DressStore application.' });
});

// Define routes and controllers for products
const productRoutes = express.Router();

// Get all products
productRoutes.route('/').get((req, res) => {
  Product.find()
    .then(products => res.status(200).json(products))
    .catch(err => res.status(400).json({ error: err }));
});

// Get product by ID
productRoutes.route('/:id').get((req, res) => {
  Product.findById(req.params.id)
    .then(product => res.status(200).json(product))
    .catch(err => res.status(400).json({ error: err }));
});

// Add new product
productRoutes.route('/').post((req, res) => {
  let product = new Product(req.body);
  product.save()
    .then(product => res.status(200).json(product))
    .catch(err => res.status(400).json({ error: err }));
});

// Update product by ID
productRoutes.route('/:id').put((req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(product => res.status(200).json(product))
    .catch(err => res.status(400).json({ error: err }));
});

// Remove product by ID
productRoutes.route('/:id').delete((req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then(() => res.status(200).json({ message: 'Product removed successfully' }))
    .catch(err => res.status(400).json({ error: err }));
});

// Remove all products
productRoutes.route('/').delete((req, res) => {
  Product.deleteMany({})
    .then(() => res.status(200).json({ message: 'All products removed successfully' }))
    .catch(err => res.status(400).json({ error: err }));
});

// Find all products which name contains 'kw'
productRoutes.route('/').get((req, res) => {
  const keyword = req.query.name;
  Product.find({ name: { $regex: keyword, $options: 'i' } })
    .then(products => res.status(200).json(products))
    .catch(err => res.status(400).json({ error: err }));
});

app.use('/api/products', productRoutes);

app.listen(port, () => {
  console.log(`Marketplace server is running on port ${port}`);
});