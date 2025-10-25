import { Schema, model, Document } from "mongoose";

export interface ISpa extends Document {
  service_name: string;
  description: string;
  credit: number;
  room_type: string;
  date: Date;
  time: string;
  time_slote: string;
  class_capacity: number;
  waiting_list_capacity: number;
  instructor: Schema.Types.ObjectId | null;
  images: string[];
  is_every_day: boolean;
  status: "Active" | "Deactive";
  type: "Spa" | "Physio";
}

const SpaSchema = new Schema<ISpa>(
  {
    service_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    credit: {
      type: Number,
      required: true,
    },
    room_type: {
      type: String,
      default: null,
    },
    date: {
      type: Date,
      default: null,
    },
    time: {
      type: String,
      default: null,
    },
    time_slote: {
      type: String,
      default: null,
    },
    class_capacity: {
      type: Number,
      required: true,
    },
    waiting_list_capacity: {
      type: Number,
      default: 0,
    },
    instructor: {
      type: Schema.ObjectId,
      ref: "User",
      default: null,
    },
    images: [
      {
        type: String,
      },
    ],
    is_every_day: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Active", "Deactive"],
      default: "Active",
    },
    type: {
      type: String,
      enum: ["Spa", "Physio"],
      default: "Spa",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Spa = model<ISpa>("Spa", SpaSchema);
