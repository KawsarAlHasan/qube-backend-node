import { Document } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    date_of_birth: Date;
    gender: "Male" | "Female" | "Other";
    profile_image?: string;
    is_verified: boolean;
    address?: string;
    role: "User" | "Driver";
    status: "Active" | "Pending" | "Blocked";
    createdAt: Date;
    updatedAt: Date;
    comparePassword(enteredPassword: string): Promise<boolean>;
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=userModel.d.ts.map