import { Router } from "express";
import {
  SignInApi,
  SignOutApi,
  SignUpApi,
} from "../controllers/auth-controller";
import { ValidationMiddleware } from "../middlewares";
import { SignInSchema, SignUpSchema } from "../schemas/auth-schema";

const authRoutes = Router();

authRoutes.post("/signup", ValidationMiddleware(SignUpSchema), SignUpApi);
authRoutes.post("/signin", ValidationMiddleware(SignInSchema), SignInApi);
authRoutes.post("/signout", SignOutApi);

export default authRoutes;
