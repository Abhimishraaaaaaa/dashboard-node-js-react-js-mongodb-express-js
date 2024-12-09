import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
//schema
const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "company Is Require"],
    },
    position: {
      type: String,
      required: [true, "Posistion Is Require"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "reject", "interview"],
      default: "pending",
    },
    workType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },
    workLocation: {
      type: String,
      default: "mumbai",
      required: [true, "workLocation Is Require"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("job", jobSchema);
