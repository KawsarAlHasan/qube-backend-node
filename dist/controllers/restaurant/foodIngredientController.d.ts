import { Request, Response } from "express";
export declare const getAllFoodIngredients: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createFoodIngredient: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSingleFoodIngredient: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateFoodIngredient: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const statusChangeFoodIngredient: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteFoodIngredient: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=foodIngredientController.d.ts.map