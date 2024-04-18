"use server";
import { handleError } from "./admin.actions";
import { connectToDatabase } from "../database/mongoose";
import MerchItem from "../database/models/merch.model";

export async function getMerchItems() {
  try {
    await connectToDatabase();
    // Create a new transaction with a buyerId
    const merchItems = await MerchItem.find();
    return JSON.parse(JSON.stringify(merchItems));
  } catch (error) {
    handleError(error);
  }
}
