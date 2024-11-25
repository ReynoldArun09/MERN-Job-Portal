import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { AppError, AsyncWrapper } from "../utils";
import { SignInSchemaType, SignUpSchemaType } from "../schemas/auth-schema";
import { User } from "../models";
import {
  ApiErrorMessages,
  ApiSuccessMessages,
  HttpStatusCode,
} from "../constants";
import jwt from "jsonwebtoken";
import { ParsedEnvVariables } from "../config";

export const SignUpApi = AsyncWrapper(
  async (req: Request<{}, {}, SignUpSchemaType>, res: Response) => {
    const { fullname, email, phoneNumber, password, role, photo } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(
        ApiErrorMessages.USER_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: photo,
      },
    });

    return res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: ApiSuccessMessages.USER_CREATED,
    });
  }
);

export const SignInApi = AsyncWrapper(
  async (req: Request<{}, {}, SignInSchemaType>, res: Response) => {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new AppError(
        ApiErrorMessages.USER_NOT_FOUND,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      throw new AppError(
        ApiErrorMessages.USER_NOT_FOUND,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const token = await jwt.sign(
      { _id: existingUser._id },
      ParsedEnvVariables.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: ParsedEnvVariables.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userData = {
      _id: existingUser._id,
      fullname: existingUser.fullname,
      email: existingUser.email,
      phoneNumber: existingUser.phoneNumber,
      role: existingUser.role,
      profile: existingUser.profile,
    };

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: ApiSuccessMessages.USER_LOGGED_IN,
      data: userData,
    });
  }
);

export const SignOutApi = AsyncWrapper(async (req: Request, res: Response) => {
  res.clearCookie("accessToken");

  return res.status(HttpStatusCode.OK).json({
    success: true,
    message: ApiSuccessMessages.USER_LOGGED_OUT,
  });
});
