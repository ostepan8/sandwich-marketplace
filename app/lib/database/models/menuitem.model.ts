import mongoose from 'mongoose';

// Interface for AddOn
interface IAddOn {
  name: string;
  additionalCost: number;
}

// Mongoose schema definition for AddOn
const addOnSchema = new mongoose.Schema<IAddOn>({
  name: {
    type: String,
    required: true,
  },
  additionalCost: {
    type: Number,
    required: true,
    min: 0, // Ensure no negative prices
  },
});

// Interface for MenuItem
interface IMenuItem {
  name: string;
  description?: string; // '?' makes it optional
  basePrice: number;
  ingredients: mongoose.Types.ObjectId[];
  available: boolean;
}

// Mongoose schema definition for MenuItem
const menuItemSchema = new mongoose.Schema<IMenuItem>({
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
    },
  ],
  available: {
    type: Boolean,
    required: true,
    default: true, // Use this to indicate if a menu item is currently available
  },
});

// Model exports
export const MenuItem = mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
