const bcrypt = require("bcrypt");
const router = require("express").Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

// Signup API for Admin
router.post("/signUp", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new admin into the database
    const insertQuery =
      "INSERT INTO enquiry_users (email, password) VALUES (?, ?)";
    db.query(insertQuery, [email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error signing up:", err);
        res
          .status(500)
          .json({ success: false, error: "Internal server error" });
      } else {
        res.status(201).json({ success: true, msg: "Signup successful" });
      }
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Signin API
router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  // Retrieve admin information based on email
  const selectQuery = "SELECT * FROM enquiry_users WHERE email = ?";

  db.query(selectQuery, [email], async (err, results) => {
    if (err) {
      console.error("Error signing in:", err);
      res.status(500).json({ success: false, error: "Internal server error" });
    } else if (results.length === 0) {
      res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    } else {
      const user = results[0];
      // Compare the entered password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = jwt.sign(
          { id: user.id, name: "user" },
          process.env.JWT_SECRET
        );
        res
          .status(200)
          .json({ success: true, token, msg: "Signin successful" });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    }
  });
});

module.exports = router;
