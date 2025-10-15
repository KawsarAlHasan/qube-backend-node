import { Schema, model, Document } from "mongoose";

interface IFood extends Document {
  food_name: string;
  food_category: Object;
  food_description: string;
  quentity: number;
  food_price: number;
  cost_on_me: number;
  colories: string;
  cook_time: string;
  food_ingredients: string[];
  extra_ingredients: string[];
  food_images: string[];
  allow_backorder: boolean;
  food_status: "Active" | "Deactive";
  createdAt: Date;
  updatedAt: Date;
}

const foodSchema = new Schema<IFood>(
  {
    food_name: {
      type: String,
      required: true,
    },
    food_category: {
      type: Schema.Types.ObjectId,
      ref: "foodCategory",
      required: true,
    },
    food_description: {
      type: String,
      default: null,
    },
    quentity: {
      type: Number,
      required: true,
    },
    food_price: {
      type: Number,
      required: true,
    },
    cost_on_me: {
      type: Number,
      default: 0,
    },
    colories: {
      type: String,
      default: null,
    },
    cook_time: {
      type: String,
      default: null,
    },
    food_ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: "foodIngredient",
      },
    ],
    extra_ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: "foodIngredient",
      },
    ],
    food_images: [
      {
        type: String,
      },
    ],
    allow_backorder: {
      type: Boolean,
      default: true,
    },
    food_status: {
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

export const food = model<IFood>("food", foodSchema);
