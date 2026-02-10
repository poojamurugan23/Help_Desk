// src/pages/DashboardAdmin.jsx
import { useEffect, useState } from "react";
import api from "../api"; // ✅ use centralized axios
import Navbar from "../components/Navbar";
import "./DashboardAdmin.css";

function DashboardAdmin() {
  const [tickets, setTickets] = useState([]);
  const [assignments, setAssignments] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTickets();
  }, []);

  // ✅ Fetch ALL tickets (ADMIN allowed)
  const fetchTickets = async () => {
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const res = await api.get("/tickets");
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    }
  };

  // ✅ Assign ticket (matches your backend)
  const handleAssign = async (ticketId) => {
    const agentId = assignments[ticketId];
    if (!agentId) return alert("Please enter an Agent ID");

    try {
      await api.put(`/tickets/${ticketId}/assign`, { agentId });

      alert("Ticket assigned!");
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="admin-dashboard"
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        <h2 className="dashboard-heading">Admin Dashboard 🧩</h2>

        <div className="ticket-grid">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card">
              <h4 className="ticket-subject">{ticket.subject}</h4>

              <p className="ticket-message">{ticket.description}</p>

              <div className="ticket-meta">
                <span className={`status-badge ${ticket.status}`}>
                  {ticket.status}
                </span>

                <span
                  className={`priority-badge ${ticket.priority.toLowerCase()}`}
                >
                  {ticket.priority}
                </span>
              </div>

              <p className="assigned-to">
                Assigned To: {ticket.assignedTo?.name || "❌ Not Assigned"}
              </p>

              <div className="assign-controls">
                <label>Assign to Agent (paste Agent ID):</label>

                <input
                  type="text"
                  placeholder="Enter Agent MongoDB ID"
                  value={assignments[ticket._id] || ""}
                  onChange={(e) =>
                    setAssignments({
                      ...assignments,
                      [ticket._id]: e.target.value,
                    })
                  }
                />

                <button onClick={() => handleAssign(ticket._id)}>Assign</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
