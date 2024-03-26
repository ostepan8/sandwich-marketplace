"use server";
import { Ingredient, MenuItem } from "@/constants/types";
import MenuItemModel from "../database/models/menuitem.model"
import IngredientModel from "../database/models/ingredient.model";
import { connectToDatabase } from "../database/mongoose";
import mongoose from "mongoose";

const handleError = (error: unknown) => {
    if (error instanceof Error) {
      // This is a native JavaScript error (e.g., TypeError, RangeError)
      console.error(error.message);
      throw new Error(`Error: ${error.message}`);
    } else if (typeof error === "string") {
      // This is a string error message
      console.error(error);
      throw new Error(`Error: ${error}`);
    } else {
      // This is an unknown type of error
      console.error(error);
      throw new Error(`Unknown error: ${JSON.stringify(error)}`);
    }
  };
// CREATE

type Props ={
  name:String,
  description:String,
  basePrice: Number,
  ingredientIds: String[],
  available: Boolean
}
export async function insertMenuItem({ name, description, basePrice, ingredientIds, available }: Props) {
  try {
    await connectToDatabase();

    const newItem = new MenuItemModel({
      name,
      description,
      basePrice,
      ingredients: ingredientIds,
      available,
    });

    await newItem.save();
    const populatedItem = await MenuItemModel.findById(newItem._id).populate(
      "ingredients"
    );
    return JSON.parse(JSON.stringify(populatedItem));
  } catch (error) {
    handleError(error);
  }
}
export async function getMenuAndIngredientData() {
    try {
      await connectToDatabase();
      const menuData = await MenuItemModel.find().populate("ingredients");
      const ingredientData:Ingredient[] = await IngredientModel.find();

      return JSON.parse(JSON.stringify({ menuData, ingredientData }));
    } catch (error) {
      handleError(error);
    }
  }
  

  export async function changeMenuItemAvailability(_id: string) {
    try {
        await connectToDatabase();

        // Find the menu item by its ID
        const menuItem = await MenuItemModel.findOne({ _id: new mongoose.Types.ObjectId(_id) });

        if (!menuItem) throw new Error("Menu item not found");

        // Change the availability of the menu item
        menuItem.available = !menuItem.available;

        // Save the updated menu item
        await menuItem.save();
        return JSON.parse(JSON.stringify(menuItem));
    } catch (error) {
        handleError(error);
    }
}

export async function deleteMenuItem(menuItemId: string) {
    try {
        await connectToDatabase();

        // Actual deletion logic
        const deletedMenuItem = await MenuItemModel.findByIdAndDelete(menuItemId);
        return deletedMenuItem ? JSON.parse(JSON.stringify(deletedMenuItem)) : null;
    } catch (error) {
        handleError(error);
    }
}

