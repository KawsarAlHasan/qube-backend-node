import { Schema, model, Document } from "mongoose";

interface IOrderFoodItem {
  food_id: Schema.Types.ObjectId | null;
  food_name: string | null;
  food_image: string | null;
  food_price: number;
  food_quantity: number;
  food_ingredients: Array<any>;
  extra_Ingredients: Array<any>;
  remove_ingredients: Array<any>;
  food_amount: number;
  food_description: string | null;
  food_category: Schema.Types.ObjectId | null;
}

interface IFoodOrder extends Document {
  user: Schema.Types.ObjectId | null;
  delivery_address: string | null;
  contact_number: string | null;
  total_quantity: number;
  delivery_fee: number;
  sub_total: number;
  total_price: number;
  food_cost: number;
  driver: Schema.Types.ObjectId | null;
  paid_status: "COD" | "Paid" | "Unpaid";
  food: IOrderFoodItem[];
  status: string;
  date: Date | null;
  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const foodOrderSchema = new Schema<IFoodOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    delivery_address: {
      type: String,
      default: null,
    },
    total_quantity: {
      type: Number,
      default: 0,
    },
    delivery_fee: {
      type: Number,
      default: 0,
    },
    sub_total: {
      type: Number,
      default: 0,
    },
    total_price: {
      type: Number,
      default: 0,
    },
    food_cost: {
      type: Number,
      default: 0,
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "driver",
      default: null,
    },
    paid_status: {
      type: String,
      enum: ["COD", "Paid", "Unpaid"],
      default: "COD",
    },
    // store a snapshot of food items (static at order time)
    food: [
      {
        food_id: {
          type: Schema.Types.ObjectId,
          ref: "food",
          default: null,
        },
        food_name: {
          type: String,
          default: null,
        },
        food_image: {
          type: String,
          default: null,
        },
        food_price: {
          type: Number,
          default: 0,
        },
        food_quantity: {
          type: Number,
          default: 0,
        },
        food_ingredients: [
          {
            _id: { type: Schema.Types.ObjectId, default: null },
            name: { type: String, default: null },
            price: { type: Number, default: 0 },
          },
        ],
        extra_Ingredients: [
          {
            _id: { type: Schema.Types.ObjectId, default: null },
            name: { type: String, default: null },
            price: { type: Number, default: 0 },
          },
        ],
        remove_ingredients: [
          {
            _id: { type: Schema.Types.ObjectId, default: null },
            name: { type: String, default: null },
          },
        ],
        amount: {
          type: Number,
          default: 0,
        },
      },
    ],
    status: {
      type: String,
      default: "Pending",
    },
    date: {
      type: Date,
      default: null,
    },
    latitude: {
      type: String,
      default: null,
    },
    longitude: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const foodOrder = model<IFoodOrder>("foodOrder", foodOrderSchema);
