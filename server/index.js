const express = require("express");
const cors = require("cors");
const app = express();
const port = 5002;

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3001"],
  })
);

app.use("/api/forms", require("./routes/form"));
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.listen(port, () => {
  console.log("Port is listining on " + port);
});
