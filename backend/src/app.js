const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/conversations", conversationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "IBM Helpdesk Backend Running" });
});

module.exports = app;
