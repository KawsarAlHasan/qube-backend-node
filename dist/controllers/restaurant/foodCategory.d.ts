import { Request, Response } from "express";
export declare const getAllFoodCategory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSingleFoodCategory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createFoodCategory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateFoodCategory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const categoryStatusChange: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteFoodCategory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=foodCategory.d.ts.map