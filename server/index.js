const express = require("express");
const app = express();
var cors = require("cors");
const port = 5002;

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use("/api/forms", require("./routes/form"));

app.listen(port, () => {
  console.log("Port is listining on " + port);
});
