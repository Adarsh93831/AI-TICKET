import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const DB_NAME ="TESTDB";
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected ! DB Host :${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.log(`MongoDB connection failed !!! : ${err}`);
    process.exit(1);
  }
};

export default connectDB;
