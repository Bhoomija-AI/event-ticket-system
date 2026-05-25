const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/", (req, res) => {
  const totalTicketsQuery = `SELECT COUNT(*) AS totalTickets FROM tickets`;
  const totalEventsQuery = `SELECT COUNT(DISTINCT event_name) AS totalEvents FROM tickets`;

  db.get(totalTicketsQuery, [], (err, ticketsResult) => {
    if (err) return res.status(500).json({ error: err.message });

    db.get(totalEventsQuery, [], (err, eventsResult) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        totalTickets: ticketsResult.totalTickets,
        totalEvents: eventsResult.totalEvents,
      });
    });
  });
});

module.exports = router;