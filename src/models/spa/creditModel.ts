import { Schema, model, Document } from "mongoose";

export interface ICredit extends Document {
  credit: number;
  price: number;
  description: string;
  status: "Active" | "Deactive";
}

const CreditSchema = new Schema<ICredit>(
  {
    credit: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
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

export const CreditModel = model<ICredit>("Credit", CreditSchema);
