const db = require("./db");

db.serialize(() => {
  // DROP old tables (important)
  db.run(`DROP TABLE IF EXISTS tickets`);
  db.run(`DROP TABLE IF EXISTS events`);

  // CREATE events table
  db.run(`
    CREATE TABLE events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      date TEXT
    )
  `);

  // CREATE tickets table (MATCHES YOUR CODE)
  db.run(`
    CREATE TABLE tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_name TEXT,
      user_name TEXT,
      price INTEGER
    )
  `);

  // INSERT sample events
  db.run(`
    INSERT INTO events (name, date)
    VALUES 
    ('Music Concert', '2026-06-01'),
    ('Tech Conference', '2026-06-10')
  `);

  // INSERT sample tickets
  db.run(`
    INSERT INTO tickets (event_name, user_name, price)
    VALUES
    ('Music Concert', 'Bhoomija', 500),
    ('Tech Conference', 'Student', 300)
  `);

  console.log("Database initialized successfully");
});

db.close();