const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());
// db connection
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@burjalarab.jzxpk.mongodb.net/${process.env.DB_NAME}retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const products = client
    .db(`${process.env.DB_NAME}`)
    .collection(`${process.env.COLLECTION_NAME}`);
  // perform actions on the collection object
  console.log("db connected");
  app.post("/addProduct", (req, res) => {
    const product = req.body.product;
    products.insertOne(product).then((result) => console.log(result));
  });
});

app.listen(8080, () => {
  console.log("app listening on port 8080");
});
