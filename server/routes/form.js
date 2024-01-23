const express = require("express");
const router = express.Router();
const client = require("../db");
const sendMail = require("../helper/mailUtils");
router.post("/applyForm", async (req, res) => {
  try {
    client.connect();
    const db = client.db("ligmr-form");
    const collection = db.collection("posts");
    const result = await collection.insertOne(req.body);

    return res.send({ success: true, result });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
});

module.exports = router;
