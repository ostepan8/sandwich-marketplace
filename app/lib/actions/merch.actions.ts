"use server";
import { handleError } from "./admin.actions";
import { connectToDatabase } from "../database/mongoose";
import MerchItemCollection from "../database/models/merch.model";
import { MerchItem } from "@/constants/types";
import { SizeLimits } from "@/constants/types";
export type MerchItemDatabase = {
  name: string;
  basePrice: number;
  description?: string;
  available: boolean;
  _id: string;
  imagePath: string;
  size?: string;
  smallLeft: number;
  mediumLeft: number;
  largeLeft: number;
  xlLeft: number;
};

export async function getMerchItems() {
  try {
    await connectToDatabase();
    // Fetch items, ensuring lean is used to get plain objects

    const items = await MerchItemCollection.find().lean<MerchItemDatabase[]>();

    const merchItems: MerchItem[] = items.map((item) => ({
      _id: item._id.toString(), // Explicitly convert _id to string
      name: item.name,
      imagePath: item.imagePath,
      available: item.available,
      description: item.description,
      basePrice: item.basePrice, // Ensure this is a number, possibly need conversion if stored otherwise
    }));

    // Calculate limits based on the items
    let tShirtLimits: SizeLimits = { small: 0, medium: 0, large: 0, xl: 0 };
    let hoodieLimits: SizeLimits = { small: 0, medium: 0, large: 0, xl: 0 };

    items.forEach((item) => {
      const limits = item.imagePath === "shirt" ? tShirtLimits : hoodieLimits;
      limits.small = item.smallLeft;
      limits.medium = item.mediumLeft;
      limits.large = item.largeLeft;
      limits.xl = item.xlLeft;
    });

    return { merchItems, tShirtLimits, hoodieLimits };
  } catch (error) {
    handleError(error);
    throw new Error("Failed to fetch merchandise items."); // Ensures the function throws or handles the error.
  }
}
