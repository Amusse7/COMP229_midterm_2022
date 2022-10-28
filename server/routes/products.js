/*
  Filename: products.js
  Author: Abdulkadir Musse
  Student ID: 300988847
  App name: Product Details
*/

// modules required for routing
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

// define the product model
let product = require("../models/products");

/* GET products List page. READ */
router.get("/", (req, res, next) => {
  // find all products in the products collection
  product.find((err, products) => {
    if (err) {
      return console.error(err);
    } else {
      res.render("products/index", {
        title: "Products",
        products: products,
      });
    }
  });
});

//  GET the Product Details page in order to add a new Product
router.get("/add", (req, res, next) => {
  res.render("products/add", {
    title: "Add Product"
  });
});

// POST process the Product Details page and create a new Product - CREATE
router.post("/add", async (req, res, next) => {
  
  // If all fields are present, proceed to add the product to the database
  if(req.body.productID && req.body.productName && req.body.productDesc && req.body.productPrice) {
    let p = new product({
      Productid: req.body.productID,
      Productname: req.body.productName,
      Description: req.body.productDesc,
      Price: parseFloat(req.body.productPrice),
    });
    await p.save();
  }

  res.redirect('/products');
});

// GET the Product Details page in order to edit an existing Product
router.get("/:id", async (req, res, next) => {

  res.render("products/details", {
    title: "Add Product",
    product: await product.findById(req.params.id)
  });
  
});

// POST - process the information passed from the details form and update the document
router.post("/:id", async(req, res, next) => {

  // If all fields are present, proceed to update the product in the database
  if(req.body.productID && req.body.productName && req.body.productDesc && req.body.productPrice) {
    await product.updateOne({_id: req.params.id},{
      Productid: req.body.productID,
      Productname: req.body.productName,
      Description: req.body.productDesc,
      Price: parseFloat(req.body.productPrice),
    }, {upsert: true});
  }

  res.redirect('/products');

});

// GET - process the delete
router.get("/delete/:id", async (req, res, next) => {
  await product.deleteOne({_id: req.params.id});
  res.redirect('/products');
});

module.exports = router;
