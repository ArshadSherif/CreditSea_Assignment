
import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    // 0 = disconnected
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      // Don't exit during tests
      if (process.env.NODE_ENV !== "test") process.exit(1);
    }
  }
};
