const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 5001;
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ligmr-admission-enquiry-form.vercel.app",
      "https://ligmrinquirydata.vercel.app",
      "https://inquiryfr.egnioldigital.com",
      "https://inquiry.ligmr.fr",
      "https://dashboard.ligmr.fr",
    ],
  })
);

app.use("/api/forms", require("./routes/form"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/userAct", require("./routes/useractivity.route"));

app.listen(port, () => {
  console.log("Port is listining on " + port);
});
