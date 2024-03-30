const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    openTime: {
      type: Date,
      required: true,
    },
    closeTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Ensure there's only one document for each setting
settingsSchema.index({ _id: 1 }, { unique: true });

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
