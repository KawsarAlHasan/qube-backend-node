import { Request, Response } from "express";
export declare const sendForgotPasswordOtp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkForgotPasswordOtp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const newPasswordSet: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=forgotPassword.d.ts.map