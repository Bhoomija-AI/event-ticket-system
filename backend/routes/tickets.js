const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET all tickets
router.get("/", (req, res) => {
  db.all("SELECT * FROM tickets", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ADD ticket
router.post("/", (req, res) => {
  const { event_name, user_name, price } = req.body;

  if (!event_name || !user_name || !price) {
    return res.status(400).json({ message: "All fields required" });
  }

  const query =
    "INSERT INTO tickets (event_name, user_name, price) VALUES (?, ?, ?)";

  db.run(query, [event_name, user_name, price], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      id: this.lastID,
      event_name,
      user_name,
      price,
    });
  });
});

module.exports = router;