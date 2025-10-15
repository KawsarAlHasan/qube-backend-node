import { Document } from "mongoose";
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
export declare const foodIngredient: import("mongoose").Model<IFoodIngredient, {}, {}, {}, Document<unknown, {}, IFoodIngredient, {}, {}> & IFoodIngredient & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=foodIngredientModal.d.ts.map