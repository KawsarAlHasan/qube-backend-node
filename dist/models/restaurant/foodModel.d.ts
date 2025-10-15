import { Document } from "mongoose";
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
export declare const food: import("mongoose").Model<IFood, {}, {}, {}, Document<unknown, {}, IFood, {}, {}> & IFood & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=foodModel.d.ts.map