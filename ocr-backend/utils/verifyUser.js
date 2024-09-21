import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = user;  // user will include the role (e.g., { id, role })
    next();
  });
};


export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(errorHandler(403, "Access denied. Admins only."));
  }
  next();
};
