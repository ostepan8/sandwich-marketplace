import mongoose from 'mongoose';

// Enum for ingredient types
enum IngredientType {
  Bread = 'Bread',
  Cheese = 'Cheese',
  Meat = 'Meat',
  Topping = 'Topping',
  Sauce = 'Sauce',
}

// Interface for Ingredient
export interface IIngredient extends Document{
  name: string;
  available: boolean;
  type: IngredientType;
}

// Mongoose schema definition
const ingredientSchema = new mongoose.Schema<IIngredient>({
  name: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
    default: true, // Assuming most ingredients are available by default
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(IngredientType), // Use the enum values
  },
});

// Model export
export const Ingredient = mongoose.model<IIngredient>('Ingredient', ingredientSchema);
