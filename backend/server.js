const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// DATABASE
const db = new sqlite3.Database("./database.db");

// CREATE TABLES
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      venue TEXT,
      date TEXT,
      capacity INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER,
      user_name TEXT,
      price INTEGER,
      status TEXT DEFAULT 'Booked'
    )
  `);
});

// TEST
app.get("/", (req, res) => {
  res.send("Server running");
});

// CREATE EVENT
app.post("/api/events", (req, res) => {
  const { name, venue, date, capacity } = req.body;

  db.run(
    "INSERT INTO events (name, venue, date, capacity) VALUES (?,?,?,?)",
    [name, venue, date, capacity],
    function () {
      res.json({ id: this.lastID });
    }
  );
});

// GET EVENTS
app.get("/api/events", (req, res) => {
  db.all("SELECT * FROM events", [], (err, rows) => {
    res.json(rows);
  });
});

// BOOK TICKET
app.post("/api/tickets", (req, res) => {
  const { event_id, user_name, price } = req.body;

  db.get(
    "SELECT capacity FROM events WHERE id = ?",
    [event_id],
    (err, event) => {
      if (!event) return res.json({ error: "Event not found" });

      db.get(
        "SELECT COUNT(*) as count FROM tickets WHERE event_id = ?",
        [event_id],
        (err, countRow) => {
          if (countRow.count >= event.capacity) {
            return res.json({ error: "Event Full" });
          }

          db.run(
            "INSERT INTO tickets (event_id, user_name, price) VALUES (?,?,?)",
            [event_id, user_name, price],
            function () {
              res.json({ id: this.lastID });
            }
          );
        }
      );
    }
  );
});

// GET TICKETS
app.get("/api/tickets", (req, res) => {
  db.all(
    `
    SELECT tickets.*, events.name as event_name
    FROM tickets
    JOIN events ON tickets.event_id = events.id
    `,
    [],
    (err, rows) => {
      res.json(rows);
    }
  );
});

// CHECK-IN TICKET
app.put("/api/tickets/:id/checkin", (req, res) => {
  const id = req.params.id;

  db.get(
    "SELECT status FROM tickets WHERE id = ?",
    [id],
    (err, row) => {
      if (row.status === "Checked-In") {
        return res.json({ error: "Already Checked In" });
      }

      db.run(
        "UPDATE tickets SET status = 'Checked-In' WHERE id = ?",
        [id],
        () => res.json({ success: true })
      );
    }
  );
});

// UPDATE STATUS
app.put("/api/tickets/:id/status", (req, res) => {
  const { status } = req.body;
  const id = req.params.id;

  db.run(
    "UPDATE tickets SET status = ? WHERE id = ?",
    [status, id],
    () => res.json({ success: true })
  );
});

// DASHBOARD
app.get("/api/dashboard/summary", (req, res) => {
  db.get(
    `
    SELECT
      (SELECT COUNT(*) FROM events) as totalEvents,
      (SELECT COUNT(*) FROM tickets) as totalTickets,
      (SELECT COUNT(*) FROM tickets WHERE status='Checked-In') as checkedIn,
      (SELECT IFNULL(SUM(price),0) FROM tickets) as revenue
    `,
    [],
    (err, row) => res.json(row)
  );
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});