const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(bodyParser.json());
app.use(cors());
// db connection
console.log(process.env.DB_Name);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@burjalarab.jzxpk.mongodb.net/${process.env.DB_NAME}retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection(`${process.env.COLLECTION_NAME}`);

  // perform actions on the collection object
  console.log("db connected error is: ", err);

  // inject all data of the application
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productsCollection
      .insertMany(product)
      .then((result, err) => console.log(result));
  });

  // get all  products for the shop page
  app.get("/products", (req, res) => {
    productsCollection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });

  // get signle product for the product deatails page
  app.get("/product/:key", (req, res) => {
    productsCollection.find({ key: req.params.key }).toArray((err, doc) => {
      res.send(doc[0]);
    });
  });
  // get many product by keys
  app.post("/productByKeys", (req, res) => {
    const productKyes = req.body;
    productsCollection
      .find({ key: { $in: productKyes } })
      .toArray((err, docs) => {
        res.send(docs);
      });
  });
  // place order to the database
});
client.connect((err) => {
  const ordersCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection(`${process.env.COLLECTION_NAME2}`);
  console.log("ordersColleciotn err", err);
  // place order
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection
      .insertOne(order)
      .then((result) => res.send(result.insertedCount > 0));
  });
});
app.listen(8080, () => {
  console.log("app listening on port 8080");
});
