import mongoose from "mongoose";
import colors from "colors";
import config from "./config";

export const dbConnect = async () => {
  try {
    await mongoose.connect(config.database_url as string);
    console.log(colors.blue(`🚀 The Mongodb database is connected successfully`));
  } catch (error) {
    console.log(colors.red(`🤢 Failed to connect Database`));
  }
};
