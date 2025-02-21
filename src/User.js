import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 1000000 },
  portfolio: [
    {
      asset: String,
      quantity: Number,
      averagePrice: Number,
      currentPrice: Number,
    },
  ],
});

const User =
  mongoose.models.Users || mongoose.model("Users", UserSchema, "Users");

module.exports = User;
