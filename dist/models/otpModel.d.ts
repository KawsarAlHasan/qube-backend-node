import { Document } from "mongoose";
export interface IOtp extends Document {
    otp: string;
    email: string;
    phone: string;
    otp_expired: Date;
    type: "emailVerification" | "phoneVerification" | "resetPassword";
    isVerified: boolean;
    createdAt: Date;
}
export declare const Otp: import("mongoose").Model<IOtp, {}, {}, {}, Document<unknown, {}, IOtp, {}, {}> & IOtp & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=otpModel.d.ts.map