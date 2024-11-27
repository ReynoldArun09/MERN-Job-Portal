import { Router } from "express";
import { AuthMiddleware } from "../middlewares";
import {
  GetCompanyApi,
  GetCompanyByIdApi,
  RegisterCompanyApi,
} from "../controllers/company-controller";

const companyRoutes = Router();

companyRoutes.post("/create-company", AuthMiddleware, RegisterCompanyApi);
companyRoutes.get("/get-company", AuthMiddleware, GetCompanyApi);
companyRoutes.post("/company/:id", AuthMiddleware, GetCompanyByIdApi);

export default companyRoutes;
