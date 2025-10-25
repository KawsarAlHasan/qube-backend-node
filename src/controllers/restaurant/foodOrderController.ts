import { Request, Response } from "express";
import { cart } from "../../models/restaurant/cartModal";
import { foodOrder } from "../../models/restaurant/foodOrderModel";
import { food as FoodModel } from "../../models/restaurant/foodModel";

// create food order from current user's cart. Only expects delivery_address, latitude, longitude in body.
export const createFoodOrder = async (req: Request, res: Response) => {
  try {
    const user = (req as any).decodedUser;
    const { delivery_address, latitude, longitude } = req.body;

    // also populate the food's own ingredients so we can compute snapshot
    const cartItems = await cart
      .find({ user: user._id })
      .populate({
        path: "food",
        populate: [{ path: "food_ingredients", model: "foodIngredient" }],
      })
      .populate("extra_Ingredients")
      .populate("remove_ingredients");

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let subtotal = 0;
    let total_quantity = 0;

    const snapshotItems: any[] = [];

    for (const item of cartItems as any) {
      const foodDoc = item.food;
      const foodPrice = foodDoc?.food_price || 0;
      const quantity = item.food_quantity || 0;

      const extraIngredients = Array.isArray(item.extra_Ingredients)
        ? item.extra_Ingredients.map((ing: any) => ({
            _id: ing._id || null,
            name: ing.ingredient_name || ing.name || null,
            price: ing.price || 0,
          }))
        : [];

      const removeIngredients = Array.isArray(item.remove_ingredients)
        ? item.remove_ingredients.map((ing: any) => ({
            _id: ing._id || null,
            name: ing.ingredient_name || ing.name || null,
          }))
        : [];

      // build base ingredients from food model (populated)
      const baseIngredients = Array.isArray(foodDoc?.food_ingredients)
        ? foodDoc.food_ingredients.map((ing: any) => ({
            _id: ing._id || null,
            name: ing.ingredient_name || ing.name || null,
            price: ing.price || 0,
          }))
        : [];

      // remove ingredients that user requested to remove (by id)
      const removeIds = new Set(
        removeIngredients.map((r: any) => (r._id ? r._id.toString() : ""))
      );

      const finalFoodIngredients = baseIngredients.filter(
        (b: any) => !removeIds.has(b._id ? b._id.toString() : "")
      );

      const extraTotal = extraIngredients.reduce(
        (s: number, e: any) => s + (Number(e.price) || 0),
        0
      );

      const amount = Number(
        (quantity * foodPrice + quantity * extraTotal).toFixed(2)
      );

      subtotal += amount;
      total_quantity += quantity;

      snapshotItems.push({
        food_id: foodDoc?._id || null,
        food_name: foodDoc?.food_name || null,
        food_image: (foodDoc?.food_images && foodDoc.food_images[0]) || null,
        food_price: foodPrice,
        food_quantity: quantity,
        food_ingredients: finalFoodIngredients,
        extra_Ingredients: extraIngredients,
        remove_ingredients: removeIngredients,
        amount,
        food_description: foodDoc?.food_description || null,
        food_category: foodDoc?.food_category || null,
      });
    }

    const delivery_fee = 3.99; // static for now; could be configurable
    const total_price = Number((subtotal + delivery_fee).toFixed(2));

    const order = await foodOrder.create({
      user: user._id,
      delivery_address: delivery_address || null,
      total_quantity,
      delivery_fee,
      sub_total: Number(subtotal.toFixed(2)),
      total_price,
      food_cost: Number(subtotal.toFixed(2)),
      food: snapshotItems,
      latitude: latitude || null,
      longitude: longitude || null,
    });

    // clear user's cart after creating order
    await cart.deleteMany({ user: user._id });

    res.status(201).json({
      success: true,
      message: "Food order created successfully",
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get my food orders
export const getMyFoodOrders = async (req: Request, res: Response) => {
  try {
    const user = (req as any).decodedUser;
    // current order is not delivered and cancelled
    const currentOrders = await foodOrder.find({
      user: user._id,
      status: { $nin: ["Delivered", "Cancelled"] },
    });
    const previousOrders = await foodOrder.find({
      user: user._id,
      status: "Delivered",
    });

    res.status(200).json({
      success: true,
      message: "My food orders fetched successfully",
      currentOrders: currentOrders || [],
      previousOrders: previousOrders || [],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get food order by id
export const getFoodOrderById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = (req as any).decodedUser;

    const order = await foodOrder.findById({
      _id: id,
      user: user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Food order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food order fetched successfully",
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// driver assign food order
export const driverAssignFoodOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { driverID } = req.body;

    if (!driverID) {
      return res.status(400).json({
        success: false,
        message: "Please provide driver id",
      });
    }

    const order = await foodOrder.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Food order not found",
      });
    }

    order.driver = driverID;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Food order driver assigned successfully",
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get driver food orders
export const getDriverFoodOrders = async (req: Request, res: Response) => {
  try {
    const driverID = (req as any).decodedUser._id;
    const currentOrders = await foodOrder.find({
      driver: driverID,
      status: { $nin: ["Delivered", "Cancelled"] },
    });

    const previousOrders = await foodOrder.find({
      driver: driverID,
      status: "Delivered",
    });

    res.status(200).json({
      success: true,
      message: "Driver food orders fetched successfully",
      currentOrders: currentOrders || [],
      previousOrders: previousOrders || [],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get all food orders
export const getAllFoodOrders = async (req: Request, res: Response) => {
  try {
    const orders = await foodOrder.find();
    res.status(200).json({
      success: true,
      message: "All food orders fetched successfully",
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// order status change
export const orderStatusChange = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide status as Active or Deactive",
      });
    }

    const data = await foodOrder.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Food order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food order status changed successfully",
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
