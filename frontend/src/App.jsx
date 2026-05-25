import { useEffect, useState } from "react";

function App() {
  const [eventName, setEventName] = useState("");
  const [userName, setUserName] = useState("");
  const [price, setPrice] = useState("");
  const [tickets, setTickets] = useState([]);

  const API = "http://localhost:5001/api/tickets";

  const fetchTickets = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setTickets(data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const addTicket = async () => {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: eventName,
          user_name: userName,
          price: Number(price),
        }),
      });

      if (!res.ok) throw new Error();

      setEventName("");
      setUserName("");
      setPrice("");
      fetchTickets();
    } catch {
      alert("Error adding ticket");
    }
  };

  return (
    <div>
      <h1>Event Ticket System</h1>

      <h2>Add Ticket</h2>
      <input
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />
      <br />
      <input
        placeholder="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <br />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br />
      <button onClick={addTicket}>Add Ticket</button>

      <h2>Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets found</p>
      ) : (
        <ul>
          {tickets.map((t) => (
            <li key={t.id}>
              {t.event_name} - {t.user_name} - ₹{t.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;