import { Schema, model, models } from "mongoose";

const ingredientSchema = new Schema({
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
        enum: ["Bread", "Cheese", "Meat", "Topping", "Sauce"], // Enumerated values
      },
});

const Ingredient = models?.Ingredient || model("Ingredient", ingredientSchema);

export default Ingredient;