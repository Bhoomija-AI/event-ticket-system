const express = require("express");
const router = express.Router();
const db = require("../database/db");

/**
 * GET all events
 */
router.get("/", (req, res) => {
  db.all("SELECT * FROM events", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/**
 * CREATE event
 */
router.post("/", (req, res) => {
  const { name, date, location } = req.body;

  db.run(
    "INSERT INTO events (name, date, location) VALUES (?, ?, ?)",
    [name, date, location],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        message: "Event created successfully",
        eventId: this.lastID,
      });
    }
  );
});

module.exports = router;