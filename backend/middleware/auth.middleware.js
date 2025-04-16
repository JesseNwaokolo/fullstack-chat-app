import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorised - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    if (!decoded)
      return res.status(401).json({ message: "Unauthorised - Invalid token" });

    const user = await userModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in Protect route", error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export { protectRoute };
