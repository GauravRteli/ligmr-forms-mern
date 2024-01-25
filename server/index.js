const express = require("express");
const cors = require("cors");
const app = express();
const port = 5001;
require("dotenv").config();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ligmr-admission-enquiry-form.vercel.app",
      "https://ligmrinquirydata.vercel.app",
    ],
  })
);

app.use("/api/forms", require("./routes/form"));
app.use("/api/auth", require("./routes/auth.route"));

app.listen(port, () => {
  console.log("Port is listining on " + port);
});
