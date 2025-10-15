import { Schema, model, Document } from "mongoose";

export interface IFoodCategory extends Document {
  category_name: string;
  category_image: string | null;
  category_status: "Active" | "Deactive";
  createdAt: Date;
  updatedAt: Date;
}

const foodCategorySchema = new Schema<IFoodCategory>(
  {
    category_name: {
      type: String,
      required: true,
    },
    category_image: {
      type: String,
      default: null,
    },
    category_status: {
      type: String,
      enum: ["Active", "Deactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const foodCategory = model<IFoodCategory>(
  "foodCategory",
  foodCategorySchema
);
