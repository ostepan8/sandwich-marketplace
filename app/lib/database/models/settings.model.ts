import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    openTime: {
      type: String,
      required: true,
    },
    closeTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Ensure there's only one document for each setting
settingsSchema.index({ _id: 1 }, { unique: true });

const Settings =
  mongoose.models?.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;
