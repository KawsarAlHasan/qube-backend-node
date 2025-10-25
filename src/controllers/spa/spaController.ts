import { Request, Response } from "express";
import { Spa } from "../../models/spa/spaModel";
import { User } from "../../models/userModel";

// create spa
export const createSpa = async (req: Request, res: Response) => {
  try {
    const {
      service_name,
      description,
      credit,
      room_type,
      date,
      time,
      time_slote,
      class_capacity,
      waiting_list_capacity,
      instructor,
      is_every_day,
      type,
    } = req.body;

    if (!service_name || !credit || !class_capacity || !instructor) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide service_name, credit, class_capacity, instructor required fields",
      });
    }

    if (!type || (type !== "Spa" && type !== "Physio")) {
      return res.status(400).json({
        success: false,
        message: "Please provide type",
      });
    }

    // Base URL for images
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Create images urls from uploaded files
    const images =
      req.files && (req.files as Express.Multer.File[]).length > 0
        ? (req.files as Express.Multer.File[]).map(
            (file) => `${baseUrl}/public/files/${file.filename}`
          )
        : [];

    const data = await Spa.create({
      service_name,
      description,
      credit,
      room_type,
      date,
      time,
      time_slote,
      class_capacity,
      waiting_list_capacity,
      instructor,
      is_every_day,
      type,
      images,
    });

    res.status(200).json({
      success: true,
      message: "Spa created successfully",
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

// update spa
export const updateSpa = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const {
      service_name,
      description,
      credit,
      room_type,
      date,
      time,
      time_slote,
      class_capacity,
      waiting_list_capacity,
      instructor,
      is_every_day,
    } = req.body;

    const preData = await Spa.findById(id);
    if (!preData) {
      return res.status(404).json({
        success: false,
        message: "Spa not found",
      });
    }

    // Base URL for images
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Create images urls from uploaded files
    const images =
      req.files && (req.files as Express.Multer.File[]).length > 0
        ? (req.files as Express.Multer.File[]).map(
            (file) => `${baseUrl}/public/files/${file.filename}`
          )
        : preData.images;

    const data = await Spa.findByIdAndUpdate(
      id,
      {
        service_name: service_name || preData.service_name,
        description: description || preData.description,
        credit: credit || preData.credit,
        room_type: room_type || preData.room_type,
        date: date || preData.date,
        time: time || preData.time,
        time_slote: time_slote || preData.time_slote,
        class_capacity: class_capacity || preData.class_capacity,
        waiting_list_capacity:
          waiting_list_capacity || preData.waiting_list_capacity,
        instructor: instructor || preData.instructor,
        is_every_day: is_every_day || preData.is_every_day,
        images,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Spa updated successfully",
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

// delete spa
export const deleteSpa = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const data = await Spa.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Spa not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Spa deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// spa status change
export const spaStatusChange = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (!status && status !== "Active" && status !== "Deactive") {
      return res.status(400).json({
        success: false,
        message: "Please provide status as Active or Deactive",
      });
    }
    const data = await Spa.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Spa not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Spa status changed successfully",
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

// // get all spa
// export const getAllSpa = async (req: Request, res: Response) => {
//   try {
//     const { service_name, date, time, time_slote, instructor, type } =
//       req.query;

//     const baseFilter: any = { status: "Active" };

//     if (type) {
//       baseFilter.type = type;
//     }

//     if (service_name) baseFilter.service_name = service_name;
//     if (date) baseFilter.date = date;
//     if (time) baseFilter.time = time;
//     if (time_slote) baseFilter.time_slote = time_slote;
//     if (instructor) baseFilter.instructor = instructor;

//     const spaData = await Spa.find({ ...baseFilter, type: "Spa" }).populate(
//       "instructor"
//     );
//     const spa = spaData.map((item: any) => {
//       const instructor = item.instructor;
//       return {
//         _id: item._id,
//         service_name: item.service_name,
//         credit: item.credit,
//         room_type: item.room_type,
//         date: item.date,
//         time: item.time,
//         time_slote: item.time_slote,
//         class_capacity: item.class_capacity,
//         waiting_list_capacity: item.waiting_list_capacity,
//         type: item.type,
//         is_every_day: item.is_every_day,
//         images: item.images[0] || "",

//         instructor_id: instructor?._id || null,
//         instructor_name: instructor?.name || null,
//       };
//     });

//     const physioData = await Spa.find({
//       ...baseFilter,
//       type: "Physio",
//     }).populate("instructor");

//     const physio = physioData.map((item: any) => {
//       const instructor = item.instructor;
//       return {
//         _id: item._id,
//         service_name: item.service_name,
//         credit: item.credit,
//         room_type: item.room_type,
//         date: item.date,
//         time: item.time,
//         time_slote: item.time_slote,
//         class_capacity: item.class_capacity,
//         waiting_list_capacity: item.waiting_list_capacity,
//         type: item.type,
//         is_every_day: item.is_every_day,
//         images: item.images[0] || "",

//         instructor_id: instructor?._id || null,
//         instructor_name: instructor?.name || null,
//       };
//     });

//     const instructorData = await User.find({
//       status: "Active",
//       role: "Instructor",
//     }).select("_id name");

//     res.status(200).json({
//       success: true,
//       message: "Spa fetched successfully",
//       instructor: instructorData || [],
//       spa: spa || [],
//       physio: physio || [],
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

export const getAllSpa = async (req: Request, res: Response) => {
  try {
    const { service_name, date, time, time_slote, instructor, type } = req.query;

    const baseFilter: any = { status: "Active" };

    if (type) baseFilter.type = type;
    if (service_name) baseFilter.service_name = service_name;
    if (date) baseFilter.date = date;
    if (time) baseFilter.time = time;
    if (time_slote) baseFilter.time_slote = time_slote;
    if (instructor) baseFilter.instructor = instructor;

    // Parallel data fetching
    const [spaData, physioData, instructorData] = await Promise.all([
      Spa.find({ ...baseFilter, type: "Spa" }).populate("instructor"),
      Spa.find({ ...baseFilter, type: "Physio" }).populate("instructor"),
      User.find({ status: "Active", role: "Instructor" }).select("_id name")
    ]);

    // Common mapping function
    const mapSpaData = (item: any) => {
      const instructor = item.instructor;
      return {
        _id: item._id,
        service_name: item.service_name,
        credit: item.credit,
        room_type: item.room_type,
        date: item.date,
        time: item.time,
        time_slote: item.time_slote,
        class_capacity: item.class_capacity,
        waiting_list_capacity: item.waiting_list_capacity,
        type: item.type,
        is_every_day: item.is_every_day,
        images: item.images[0] || "",
        instructor_id: instructor?._id || null,
        instructor_name: instructor?.name || null,
      };
    };

    const spa = spaData.map(mapSpaData);
    const physio = physioData.map(mapSpaData);

    res.status(200).json({
      success: true,
      message: "Spa fetched successfully",
      instructor: instructorData || [],
      spa: spa || [],
      physio: physio || [],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// export const getAllSpa = async (req: Request, res: Response) => {
//   try {
//     const { service_name, date, time, time_slote, instructor, type } =
//       req.query;

//     // base filter
//     const baseFilter: any = { status: "Active" };

//     if (type) {
//       baseFilter.type = type;
//     }

//     if (service_name) baseFilter.service_name = service_name;
//     if (date) baseFilter.date = date;
//     if (time) baseFilter.time = time;
//     if (time_slote) baseFilter.time_slote = time_slote;
//     if (instructor) baseFilter.instructor = instructor;

//     const spaFilter = { ...baseFilter, type: "Spa" };
//     const physioFilter = { ...baseFilter, type: "Physio" };

//     const [spa, physio] = await Promise.all([
//       Spa.find(spaFilter),
//       Spa.find(physioFilter),
//     ]);

//       const foods = foodsData.map((item) => {
//       const category = item.food_category as { category_name?: string };
//       return {
//         _id: item._id,
//         food_name: item.food_name,
//         food_images: item.food_images[0] || null,
//         category_name: category?.category_name || null,
//         food_price: item.food_price,
//       };
//     });

//     res.status(200).json({
//       success: true,
//       message: "Spa fetched successfully",
//       spa: spa || [],
//       physio: physio || [],
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// get single spa
export const getSingleSpa = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const data = await Spa.findById(id).populate("instructor");
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Spa not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Spa fetched successfully",
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
