// src/pages/DashboardCustomer.jsx
import { useState, useEffect } from "react";
import api from "../api"; // IMPORTANT: use centralized axios
import ChatBox from "../components/ChatBox";
import "./DashboardCustomer.css";
import Navbar from "../components/Navbar";

function DashboardCustomer() {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "LOW",
  });

  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You are not logged in!");
      return;
    }

    try {
      const res = await api.post("/tickets", {
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority,
        department: "General",
      });

      alert("Ticket created!");

      setFormData({
        subject: "",
        description: "",
        priority: "LOW",
      });

      // Add new ticket to UI
      setTickets((prev) => [...prev, res.data.ticket]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create ticket");
    }
  };

  const fetchTickets = async () => {
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const res = await api.get("/tickets");
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error("Failed to load your tickets", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="dashboard-scroll-container">
        <div className="customer-dashboard-timeline">
          <h2 className="dashboard-heading">Welcome, Customer 👋</h2>

          <form className="ticket-form" onSubmit={handleSubmit}>
            <h3>Create a Ticket</h3>

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Describe your issue"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            <button type="submit">Submit Ticket</button>
          </form>

          <div className="timeline-container">
            <h3>My Tickets</h3>

            <div className="timeline">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="timeline-item">
                  <div className="timeline-dot"></div>

                  <div className="timeline-content">
                    <h4>{ticket.subject}</h4>
                    <p>{ticket.description}</p>

                    <p>
                      <strong>Priority:</strong> {ticket.priority}
                    </p>

                    <span className={`status-badge ${ticket.status}`}>
                      {ticket.status}
                    </span>

                    <ChatBox ticketId={ticket._id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCustomer;
