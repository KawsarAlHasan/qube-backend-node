import { Schema, model, Document } from "mongoose";

export interface IFoodIngredient extends Document {
  ingredient_name: string;
  ingredient_image: string;
  price: number;
  cost_on_me: number;
  quentity: number;
  allow_backorder: boolean;
  ingredient_status: string;
  createdAt: Date;
  updatedAt: Date;
}

const foodIngredientSchema = new Schema<IFoodIngredient>(
  {
    ingredient_name: {
      type: String,
      required: true,
    },
    ingredient_image: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      default: 0,
    },
    cost_on_me: {
      type: Number,
      default: 0,
    },
    quentity: {
      type: Number,
      default: 0,
    },
    allow_backorder: {
      type: Boolean,
      default: true,
    },
    ingredient_status: {
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

export const foodIngredient = model<IFoodIngredient>(
  "foodIngredient",
  foodIngredientSchema
);
