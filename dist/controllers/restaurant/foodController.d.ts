import { Request, Response } from "express";
export declare const createFood: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllFood: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSingleFood: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateFood: (req: Request, res: Response) => Promise<void>;
export declare const statusChangeFood: (req: Request, res: Response) => Promise<void>;
export declare const deleteFood: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=foodController.d.ts.map