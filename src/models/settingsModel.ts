import mongoose, { Schema, model, Document } from "mongoose";

export interface ISettingSchema extends Document {
  type: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingSchema = new Schema<ISettingSchema>(
  {
    type: { type: String, enum: ["about", "privacy", "terms"], unique: true },
    name: String,
    content: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Settings = model<ISettingSchema>("Settings", settingSchema);

export const initializeSettings = async (): Promise<void> => {
  try {
    const count = await Settings.countDocuments();
    if (count === 0) {
      const defaultSettings = [
        {
          type: "about" as const,
          name: "About Us",
          content:
            "Default about us content... Update this with your information.",
        },
        {
          type: "privacy" as const,
          name: "Privacy Policy",
          content:
            "Default privacy policy... Update this with your legal terms.",
        },
        {
          type: "terms" as const,
          name: "Terms & Conditions",
          content:
            "Default terms and conditions... Update this with your legal terms.",
        },
      ];

      await Settings.insertMany(defaultSettings);
    }
  } catch (error) {
    throw error;
  }
};

// MongoDB connection event listener for initialization
mongoose.connection.once("open", () => {
  initializeSettings().catch((error) => {
    console.error("Failed to initialize settings:", error);
  });
});

export default Settings;
