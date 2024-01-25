const express = require("express");
const cors = require("cors");
const connectToMongoDB = require("./db/index");
const app = express();
const port = 5002;

// Connect to MongoDB Atlas
connectToMongoDB();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://ligmr-admission-enquiry-form.vercel.app",
    ],
  })
);

app.use("/api/forms", require("./routes/form"));

app.listen(port, () => {
  console.log("Port is listining on " + port);
});
