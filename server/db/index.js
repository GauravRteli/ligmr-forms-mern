const mongoose = require("mongoose");

// url for connect database
const mongoURI =
  "mongodb+srv://harshilprajapati9192:harshil@cluster0.ig7ijgr.mongodb.net/?retryWrites=true&w=majority";

const connectToMongoDB = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to Mongo Successfully");
  });
};

module.exports = connectToMongoDB;
// module.exports = client;
