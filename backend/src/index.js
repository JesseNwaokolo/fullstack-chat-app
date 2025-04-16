import express from "express";
import { app, server } from "../lib/socket.js";
import dotenv from "dotenv";
dotenv.config();
import path from "path"
const __dirname = path.resolve()
import cors from "cors";

import cookieParser from "cookie-parser";

const port = process.env.PORT;

import { connectDB } from "../lib/db.js";

import authRoutes from "../routes/auth.route.js";
import messageRoutes from "../routes/message.route.js";

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

server.listen(port, () => {
  console.log("Server is running on port " + port);
  connectDB();
});
