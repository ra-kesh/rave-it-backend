import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

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

// cors
// let allowedOrigins = ["http://localhost:3000", "http://192.168.43.156:3000"];

// app.use(function (req, res, next) {
//   var origin = req.headers.origin;
//   console.log("origin: ", origin);

//   if (origin) {
//     if (allowedOrigins.indexOf(origin) > -1) {
//       res.setHeader("Access-Control-Allow-Origin", origin);
//     } else {
//       console.log("trying to access from other origin.");
//       return res.status(400).json({ message: "Origin not allowed" });
//     }
//   }

//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,HEAD,OPTIONS,POST,PUT,DELETE"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("revvit");
});

// routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/notifications", notificationRoutes);
app.use("/connection", connectionRoutes);

// error Handellers
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
