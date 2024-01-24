const express = require("express");
const cors = require("cors");
const connectToMongoDB = require("./db/index");
const app = express();
const port = 5002;

// Connect to MongoDB Atlas
connectToMongoDB()
  .then((client) => {
    // Add MongoDB client to the request object to use in route handlers
    app.use((req, res, next) => {
      console.log("middled client");
      req.dbClient = client;
      next();
    });

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

    // Example: Close the MongoDB connection when your application exits
    process.on("SIGINT", () => {
      client.close();
      console.log("MongoDB Atlas connection closed");
      process.exit(0);
    });
  })
  .catch((error) => {
    console.error("Unable to start server:", error);
  });
