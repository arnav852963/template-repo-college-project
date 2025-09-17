import mongoose from "mongoose";

const patentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  abstract: { type: String, required: true, trim: true },
  applicationNumber: { type: String, unique: true, required: true },
  filedDate: { type: Date, required: true },
  status: { type: String, enum: ["Filed", "Published", "Approved", "Rejected"], default: "Approved" },
  pdfUrl: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: [{ type: String, trim: true }]
}, { timestamps: true });

export const Patent = mongoose.model("Patent", patentSchema);
