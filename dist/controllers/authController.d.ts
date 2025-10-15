import { Request, Response } from "express";
export declare const emailLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const signUpUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyEmailOtp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const resendVerifyEmailOtp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProfile: (req: Request, res: Response) => Promise<void>;
export declare const updateProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authController.d.ts.map