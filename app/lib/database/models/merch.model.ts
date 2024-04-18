import { Schema, model, models } from "mongoose";
const merchItem = new Schema({
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
  available: {
    type: Boolean,
    required: true,
    default: true, // Use this to indicate if a menu item is currently available
  },
  imagePath: {
    type: String,
    required: true,
    default: true,
  },
});

const MerchItem = models?.MerchItem || model("MerchItem", merchItem);

export default MerchItem;
