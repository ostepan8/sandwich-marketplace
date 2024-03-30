"use server";
import Settings from "../database/models/settings.model";

import { connectToDatabase } from "../database/mongoose";
import { handleError } from "./admin.actions";

export async function insertOrUpdateTime(openTime: string, closeTime: string) {
  try {
    await connectToDatabase();

    // The predefined _id for the single settings document
    const settingsId = "settings";

    // Insert or update the single settings document with the provided openTime and closeTime
    const updatedSettings = await Settings.findByIdAndUpdate(
      settingsId,
      { _id: settingsId, openTime, closeTime },
      { new: true, upsert: true } // This creates the document if it doesn't exist
    );

    // Return the updated settings document
    return JSON.parse(JSON.stringify(updatedSettings));
  } catch (error) {
    handleError(error);
  }
}
export async function getCurrentSettings() {
  try {
    await connectToDatabase();

    // The predefined _id for the settings document
    const settingsId = "settings";

    // Attempt to find the settings document by its _id
    const currentSettings = await Settings.findById(settingsId);

    // Return the found settings document or null if not found
    return currentSettings ? JSON.parse(JSON.stringify(currentSettings)) : null;
  } catch (error) {
    handleError(error);
  }
}
