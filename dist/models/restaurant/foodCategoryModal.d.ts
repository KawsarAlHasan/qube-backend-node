import { Document } from "mongoose";
export interface IFoodCategory extends Document {
    category_name: string;
    category_image: string | null;
    category_status: "Active" | "Deactive";
    createdAt: Date;
    updatedAt: Date;
}
export declare const foodCategory: import("mongoose").Model<IFoodCategory, {}, {}, {}, Document<unknown, {}, IFoodCategory, {}, {}> & IFoodCategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=foodCategoryModal.d.ts.map