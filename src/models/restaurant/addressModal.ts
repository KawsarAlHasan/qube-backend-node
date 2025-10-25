import { Schema, model, Document } from "mongoose";

export interface IAddress extends Document {
  user: Object;
  title: string;
  address: string;
  latitude: string | null;
  longitude: string | null;
  isDefault: boolean;
}

const addressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      default: null,
    },
    longitude: {
      type: String,
      default: null,
    },
    isDefault: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const addressModel = model<IAddress>("address", addressSchema);
