"use server";
import { Ingredient } from '../../../../backend/models/Ingredient';
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

type IngredientProps ={
    name:String,
    type:String,
}
export async function insertIngredient({name,type}: IngredientProps) {
  try {
    await connectToDatabase();

    const newUser = await Ingredient.create({name,type});

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

export async function changeAvailability(_id: string) {
    try {
      await connectToDatabase();
  
      // Find the ingredient by its ID
      const ingredient = await Ingredient.findOne({ _id: new mongoose.Types.ObjectId(_id) });
  
      if (!ingredient) throw new Error("Ingredient not found");
  
      // Change the availability of the ingredient
      ingredient.available = !ingredient.available;
  
      // Save the updated ingredient
      await ingredient.save();
  
      return JSON.parse(JSON.stringify(ingredient));
    } catch (error) {
      handleError(error);
    }
  }


  export async function deleteIngredient(ingredientId: string) {
    try {
      await connectToDatabase();
      await Ingredient.find({}).then(ingredients => {
        console.log(ingredients);
    }).catch(error => {
        console.error('Error fetching ingredients:', error);
    });
    
  
      // Find the ingredient to delete
      // const ingredientToDelete = await Ingredient.findOne({ _id: new mongoose.Types.ObjectId(ingredientId) });
  
      // if (!ingredientToDelete) {
      //   throw new Error("Ingredient not found");
      // }
      // const deletedIngredient = await Ingredient.findByIdAndDelete(ingredientToDelete._id);
      // return deletedIngredient ? JSON.parse(JSON.stringify(deletedIngredient)) : null;
      return []
    } catch (error) {
      handleError(error);
    }
  }

