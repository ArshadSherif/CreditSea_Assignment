import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connectDB} from "./config/dbConnection.js";
import xmlRoutes from "./routes/xmlRoutes.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();

app.use(logger);


app.use(cors());
app.use(express.json());

app.use("/api", xmlRoutes);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

