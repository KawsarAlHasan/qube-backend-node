import { Request, Response } from "express";
import { addressModel } from "../../models/restaurant/addressModal";

// create address
export const createAddress = async (req: Request, res: Response) => {
  try {
    const user = (req as any).decodedUser._id;
    const { title, address, latitude, longitude, isDefault } = req.body;

    if (!title || !address || !latitude || !longitude ) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and address",
      });
    }

    if (isDefault) {
      await addressModel.updateMany({ user: user._id }, { isDefault: false });
    }

    const data = await addressModel.create({
      user: user._id,
      title: title,
      address: address,
      latitude: latitude,
      longitude: longitude,
      isDefault: isDefault,
    });

    res.status(200).json({
      success: true,
      message: "Address created successfully",
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

// get all address
export const getAllAddress = async (req: Request, res: Response) => {
  try {
    const user = (req as any).decodedUser._id;
    const defultAddress = await addressModel.findOne({
      user: user._id,
      isDefault: true,
    });
    const otherAddress = await addressModel.find({
      user: user._id,
      isDefault: false,
    });

    res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      defultAddress: defultAddress,
      otherAddress: otherAddress,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// updated address
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, address, latitude, longitude, isDefault } = req.body;

    const userId = (req as any).decodedUser._id;
    const preData = await addressModel.findById(id);

    if (!preData) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    if (isDefault === true) {
      await addressModel.updateMany(
        { user: userId, _id: { $ne: id } },
        { isDefault: false }
      );
    }

    if (preData.isDefault === true && isDefault === false) {
      const otherDefault = await addressModel.findOne({
        user: userId,
        _id: { $ne: id },
        isDefault: true,
      });

      if (!otherDefault) {
        const anotherAddress = await addressModel.findOne({
          user: userId,
          _id: { $ne: id },
        });

        if (anotherAddress) {
          anotherAddress.isDefault = true;
          await anotherAddress.save();
        }
      }
    }

    const data = await addressModel.findByIdAndUpdate(
      id,
      {
        title: title ?? preData.title,
        address: address ?? preData.address,
        latitude: latitude ?? preData.latitude,
        longitude: longitude ?? preData.longitude,
        isDefault: isDefault ?? preData.isDefault,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// delete address
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).decodedUser._id;

    const preData = await addressModel.findById({
      _id: id,
      user: userId,
    });
    if (!preData) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    if (preData.isDefault == true) {
      const anotherAddress = await addressModel.findOne({
        user: userId,
        _id: { $ne: id },
      });

      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

    await addressModel.findByIdAndDelete({
      _id: id,
      user: userId,
    });

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
