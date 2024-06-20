import mongoose from "mongoose";

const connect = async () => {
  if (mongoose.connection.readyState) return;

  try {
    await mongoose.connect(process.env.MONGODB_URL, {});
    console.log("Mongo Connection successfully established.");
  } catch (error) {
    console.error("Error connecting to Mongoose:", error);
    throw new Error("Error connecting to Mongoose");
  }
};

export default connect;
