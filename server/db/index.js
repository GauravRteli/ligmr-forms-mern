const { MongoClient } = require("mongodb");

// url for connect database
const mongoURI =
  "mongodb+srv://harshilprajapati9192:harshil@cluster0.ig7ijgr.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(mongoURI);

module.exports = client;
