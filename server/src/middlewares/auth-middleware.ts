import { RequestHandler } from "express";
import {
  ApiErrorMessages,
  GlobalErrorMessages,
  HttpStatusCode,
} from "../constants";
import { ParsedEnvVariables } from "../config";
import { AppError } from "../utils";
import { User } from "../models";
import { JWTPayloadType } from "../global";
import jwt from "jsonwebtoken";

export const AuthMiddleware: RequestHandler = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ message: GlobalErrorMessages.UNAUTHORIZED });
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      ParsedEnvVariables.ACCESS_TOKEN_SECRET
    ) as JWTPayloadType;

    const existingCustomer = await User.findById(decoded._id);

    if (!existingCustomer) {
      throw new AppError(
        ApiErrorMessages.INVALID_TOKEN,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const userObject = {
      _id: existingCustomer._id,
      email: existingCustomer.email,
      role: existingCustomer.role,
      fullname: existingCustomer.fullname,
    };

    req.user = userObject;
    next();
  } catch (error) {
    next(error);
  }
};
