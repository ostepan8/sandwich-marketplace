import mongoose, { Schema, model, models } from "mongoose";

// Define the schema for a cart item
const CartItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["menuItem", "merchItem"], // Restrict types to 'menu' or 'merch'
    },
    ingredients: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Ingredient",
        required: function () {
          return this.type === "menuItem";
        }, // Only required if type is 'menu'
      },
    ],
    size: {
      type: String,
      required: function () {
        return this.type === "merchItem";
      }, // Only required if type is 'merch'
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

// Define the transaction schema
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
  cartItems: [CartItemSchema], // Embed the CartItem schema here
  completed: {
    type: Boolean,
    default: false,
  },
  pickUpTime: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // If email is not always required, you can remove 'required: true'
  },
  name: {
    type: String,
  },
});

const Transaction =
  models.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
