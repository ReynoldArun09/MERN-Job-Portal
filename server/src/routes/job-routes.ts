import { Router } from "express";
import { AuthMiddleware } from "../middlewares";
import {
  GetAdminJobsApi,
  GetAllJobsApi,
  GetJobByIdApi,
  PostJobApi,
} from "../controllers/job-controller";

const jobRoutes = Router();

jobRoutes.post("/create-job", AuthMiddleware, PostJobApi);
jobRoutes.get("/all-jobs", AuthMiddleware, GetAllJobsApi);
jobRoutes.get("/single/:id", AuthMiddleware, GetJobByIdApi);
jobRoutes.get("/admin-jobs", AuthMiddleware, GetAdminJobsApi);

export default jobRoutes;
