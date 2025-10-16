import { Request, Response } from "express";
import { cart } from "../../models/restaurant/cartModal";

// add to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const user = (req as any).decodedUser;

    const { food, food_quantity, extra_Ingredients, remove_ingredients } =
      req.body;

    if (!food || !food_quantity) {
      return res.status(400).json({
        success: false,
        message: "Please provide food and quantity",
      });
    }

    const parsedExtraIngredients = Array.isArray(extra_Ingredients)
      ? extra_Ingredients
      : [];
    const parsedRemoveIngredients = Array.isArray(remove_ingredients)
      ? remove_ingredients
      : [];

    const data = await cart.create({
      user: user._id,
      food: food,
      food_quantity: food_quantity,
      extra_Ingredients: parsedExtraIngredients,
      remove_ingredients: parsedRemoveIngredients,
    });

    res.status(200).json({
      success: true,
      message: "Food added to cart successfully",
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get my cart
export const getMyCart = async (req: Request, res: Response) => {
  try {
    const user = (req as any).decodedUser;
    const data = await cart
      .find({ user: user._id })
      .populate("food")
      .populate("extra_Ingredients")
      .populate("remove_ingredients");
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    let subtotal = 0;

    const updatedCart = data.map((item: any) => {
      const foodPrice = item.food?.food_price || 0;
      const quantity = item.food_quantity || 0;

      const extraIngredientsTotal = item.extra_Ingredients?.reduce(
        (sum: number, ingredient: any) => sum + (ingredient?.price || 0),
        0
      );

      const amount = quantity * foodPrice + quantity * extraIngredientsTotal;

      subtotal += amount;

      return {
        ...item._doc,
        amount: Number(amount.toFixed(2)),
      };
    });

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      subtotal,
      data: updatedCart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// remove from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const user = (req as any).decodedUser;
    const id = req.params.id;
    const data = await cart.findByIdAndDelete({ user: user._id, _id: id });
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// update cart
export const updateCart = async (req: Request, res: Response) => {
  try {
    const user = (req as any).decodedUser;
    const { id, food_quantity } = req.body;
    if (!id || !food_quantity) {
      return res.status(400).json({
        success: false,
        message: "Please provide id and quantity",
      });
    }
    const data = await cart.findOneAndUpdate(
      { user: user._id, _id: id },
      { food_quantity: food_quantity },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// clear cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const user = (req as any).decodedUser;
    const data = await cart.deleteMany({ user: user._id });
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
