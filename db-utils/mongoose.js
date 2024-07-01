import mongoose from "mongoose";

const localUri = "mongodb://127.0.0.1:27017/pro";

const mongooseConnect = async () => {
  try {
    await mongoose.connect(localUri);
    console.log("Mongoose Connection established");
  } catch (e) {
    console.log("Mongoose Connection error: " + e.message);
    // process.exit(1);
  }
};

export default mongooseConnect;
