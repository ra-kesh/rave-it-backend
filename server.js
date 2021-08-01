import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";

import {
  errorHandlerMiddleware,
  notFoundMiddleware,
} from "./middlewares/errorMiddleware.js";

//for env
import dotenv from "dotenv";
dotenv.config();

// database;
import connectDB from "./configs/db.js";
connectDB();

//connecting main app
const app = express();
app.use(cors());

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("it's my api..bitch");
});

// routes
app.use("/api/users", userRoutes);

// error Handellers
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// port
const port = process.env.PORT || 800;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
