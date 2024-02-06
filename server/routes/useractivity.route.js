const router = require("express").Router();
const { dbQueryAsync } = require("../helper");

// API endpoint to insert data into the user_activity table
router.post("/addActivity", async (req, res) => {
  const { ipAddress, source, request_type } = req.body;
  try {
    if (
      ipAddress !== undefined &&
      source !== undefined &&
      ipAddress !== "" &&
      source !== ""
    ) {
      const result = await dbQueryAsync(
        "INSERT INTO user_activity (ip_address, source,request_type) VALUES (?,?,?)",
        [ipAddress, source, request_type]
      );
      return res.status(201).json({ success: true, result });
    }
    return res.send({ success: false, error: "IPAdress or source not found" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to retrieve all records from the user_activity table
router.get("/user_activity", async (req, res) => {
  try {
    const result = await dbQueryAsync("SELECT * FROM user_activity");

    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint for platform-wise with unique IP
router.get("/platformwise", async (req, res) => {
  try {
    const result = await dbQueryAsync(`
        SELECT source, COUNT(DISTINCT ip_address) AS unique_ip_count
        FROM user_activity
        GROUP BY source
      `);

    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint for total engagement
router.get("/total_engagement", async (req, res) => {
  try {
    const result = await dbQueryAsync(
      "SELECT COUNT(*) AS total_engagement FROM user_activity"
    );

    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint for unique IP-wise count
router.get("/unique_ip_count", async (req, res) => {
  try {
    const result = await dbQueryAsync(`
        SELECT  COUNT(*) AS event_count
        FROM user_activity
        GROUP BY ip_address
      `);

    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint for all IP-wise count
router.get("/all_ip_count", async (req, res) => {
  try {
    const result = await dbQueryAsync(`
        SELECT ip_address, COUNT(*) AS event_count
        FROM user_activity
        GROUP BY ip_address
      `);

    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint for day-wise count
router.get("/daywise_count", async (req, res) => {
  try {
    const result = await dbQueryAsync(`
        SELECT DATE(timestamp) AS event_date, COUNT(*) AS event_count
        FROM user_activity
        GROUP BY event_date
        ORDER BY event_date
      `);

    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint for per hour-wise count
router.get("/per_hour_count", async (req, res) => {
  try {
    const result = await dbQueryAsync(`
        SELECT EXTRACT(HOUR FROM timestamp) AS event_hour, COUNT(*) AS event_count
        FROM user_activity
        GROUP BY event_hour
        ORDER BY event_hour
      `);

    res.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
