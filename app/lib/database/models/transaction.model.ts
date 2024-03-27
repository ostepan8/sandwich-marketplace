import mongoose, { Schema, model, models } from "mongoose";

// Define a schema that can handle both standard menu items and custom sandwiches
const CartItemSchema = new Schema({
  menuItem: {
    type: Schema.Types.ObjectId, // Reference by ID for standard menu items
    ref: "MenuItem", // Points to the MenuItem model
    required: false, // Set to false because custom sandwiches might not have an existing MenuItem
  },
  customDetails: {
    name: { type: String, required: false }, // For custom sandwiches
    ingredients: [{ type: String, required: false }], // List of ingredients for custom sandwiches
    price: { type: Number, required: false }, // Price for custom sandwiches
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const TransactionSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  cartItems: [
    {
      type: mongoose.Types.ObjectId,
      ref: "MenuItem",
    },
  ],
});

const Transaction =
  models.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
