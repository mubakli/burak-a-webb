const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ipAddress: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
