const express = require("express");
const { MongoClient } = require("mongodb");
const NameSchema = require("../schema/name.schema.js");
const api = express.Router();

let collection = null;
MongoClient.connect(process.env.MONGODB_URL)
  .then(mongo => {
    collection = mongo.db("mydb").collection("name-submit");
    console.log("Mongodb Connect Success");
  })
  .catch(err => {
    console.log("-error-->", err.message);
  })

api.post("/send", express.urlencoded(), async (req, res) => {
  const data = new NameSchema(req.body);
  const res3 = await collection.findOne(data);
  if (res3 != null) {
    throw {
      message: "This Data is already Entry"
    }
  }
  await collection.insertOne(data);
  res.status(200).redirect("/");
})

const isAdminMiddle = (req, res, next) => {
  if (req.body.password !== process.env.ADMIN_PASSWORD) {
    throw {
      message: "Admin Password is Wrong"
    }
  }
  delete req.body.password;
  next();
}

api.use(express.json(), isAdminMiddle);

api.delete("/admin", async (req, res) => {
  const data = req.body;
  const { deletedCount } = await collection.deleteOne(data);
  if (!deletedCount) {
    throw {
      message: "Delete Request Faild - Data not found"
    }
  }
  res.status(200).end();
})

api.post("/admin", async (req, res) => {
  let data = await collection.find()
    .sort({ firstName: 1 })
    .toArray();
  data = data.map(iv => {
    delete iv._id;
    return iv;
  })
  res.status(200).json(data);
})

module.exports = api;