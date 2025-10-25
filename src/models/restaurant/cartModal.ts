import { Schema, model, Document } from "mongoose";

export interface ICart extends Document {
  user: Object;
  food: Object;
  food_quantity: number;
  extra_Ingredients: Array<Object>;
  remove_ingredients: Array<Object>;
}

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    food: {
      type: Schema.Types.ObjectId,
      ref: "food",
      required: true,
    },
    food_quantity: {
      type: Number,
      required: true,
    },
    extra_Ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: "foodIngredient",
        required: true,
      },
    ],
    remove_ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: "foodIngredient",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const cart = model<ICart>("cart", cartSchema);
