const express = require("express");
const app = express();

const port = 5002;

app.use(express.json());

app.use("/api/forms", require("./routes/form"));

app.listen(port, () => {
  console.log("Port is listining on " + port);
});
