import mongoose from "mongoose";

const UserModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "admin"
    },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    occupation: { type: String },
    phoneNumber: { type: String },
    transactions: Array,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserModel);
export default User;