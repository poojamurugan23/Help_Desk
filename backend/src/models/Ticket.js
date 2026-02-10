const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "LOW",
    },
    status: {
      type: String,
      enum: [
        "OPEN",
        "IN_PROGRESS",
        "WAITING_FOR_CUSTOMER",
        "RESOLVED",
        "CLOSED",
      ],
      default: "OPEN",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    department: {
      type: String,
      default: "General",
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Ticket", ticketSchema);
