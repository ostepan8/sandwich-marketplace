import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";
const menuItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String, // Description isn't always required, so 'required: false' is omitted (it's false by default)
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0, // Ensure no negative prices
  },
  ingredients: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Ingredient",
    },
  ],
  available: {
    type: Boolean,
    required: true,
    default: true, // Use this to indicate if a menu item is currently available
  },
});

const MenuItem = models?.MenuItem || model("MenuItem", menuItemSchema);

export default MenuItem;
