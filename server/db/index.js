const { MongoClient } = require("mongodb");
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// url for connect database
const mongoURI =
  "mongodb+srv://harshilprajapati9192:harshil@cluster0.ig7ijgr.mongodb.net/?retryWrites=true&w=majority";

// const client = new MongoClient(mongoURI);
async function connectToMongoDB() {
  const client = new MongoClient(mongoURI, options);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    throw error;
  }
}
module.exports = connectToMongoDB;
// module.exports = client;
