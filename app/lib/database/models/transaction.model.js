import mongoose, { Schema, model, models } from "mongoose";

// Define the schema for a cart item
const CartItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Ingredient", // Assuming "Ingredient" is another model
        required: true,
      },
    ],
    quantity: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  { _id: false }
); // Optionally disable _id for subdocuments if not needed

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
// import mongoose, { Schema, model, models } from "mongoose";

// // Define the schema for a cart item
// const CartItemSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     type: {
//       type: String,
//       enum: ["menuItem", "merchItem"], // Restrict types to 'menu' or 'merch'
//     },
//     ingredients: [
//       {
//         type: mongoose.Types.ObjectId,
//         ref: "Ingredient",
//       },
//     ],
//     size: {
//       type: String,
//     },
//     quantity: {
//       type: Number,
//     },
//   },
//   { _id: false }
// );

// // Define the transaction schema
// const TransactionSchema = new Schema({
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   stripeId: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   cartItems: [CartItemSchema], // Embed the CartItem schema here
//   completed: {
//     type: Boolean,
//     default: false,
//   },
//   pickUpTime: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     // If email is not always required, you can remove 'required: true'
//   },
//   name: {
//     type: String,
//   },
// });

// const Transaction =
//   models.Transaction || model("Transaction", TransactionSchema);

// export default Transaction;
