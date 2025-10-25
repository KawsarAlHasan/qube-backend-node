import { Request, Response } from "express";
import { CreditModel } from "../../models/spa/creditModel";

export const createCredit = async (req: Request, res: Response) => {
  try {
    const { credit, price, description } = req.body;

    if (!credit || !price || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide credit, price, description required fields",
      });
    }

    const data = await CreditModel.create({
      credit,
      price,
      description,
    });

    return res.status(200).json({
      success: true,
      message: "Credit created successfully",
      data: data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllCredit = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const query: any = {};

    if (status !== "all") {
      query.status = status == "Deactive" ? "Deactive" : "Active";
    }

    const data = await CreditModel.find(query);

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No credit found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Credit fetched successfully",
      data: data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// edit credit
export const editCredit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { credit, price, description } = req.body;

    const preData = await CreditModel.findById(id);
    if (!preData) {
      return res.status(404).json({
        success: false,
        message: "Credit not found",
      });
    }

    const data = await CreditModel.findByIdAndUpdate(
      id,
      {
        credit: credit || preData.credit,
        price: price || preData.price,
        description: description || preData.description,
      },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Credit not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Credit updated successfully",
      data: data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// delete create
export const deleteCredit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const data = await CreditModel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Credit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Credit deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// status change
export const statusChangeCredit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (!status && status !== "Active" && status !== "Deactive") {
      return res.status(400).json({
        success: false,
        message: "Please provide status as Active or Deactive",
      });
    }
    const data = await CreditModel.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Credit not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Credit status changed successfully",
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
