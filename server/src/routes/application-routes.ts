import { Router } from "express";
import { AuthMiddleware } from "../middlewares";
import {
  ApplyJobApi,
  GetApplicantsApi,
  GetAppliedJobsApi,
  UpdateStatusApi,
} from "../controllers/application-controller";

const applicationRoutes = Router();
applicationRoutes.post("/apply/:id", AuthMiddleware, ApplyJobApi);
applicationRoutes.get("/get", AuthMiddleware, GetAppliedJobsApi);
applicationRoutes.get("/:id/applicants", AuthMiddleware, GetApplicantsApi);
applicationRoutes.post("/status/:id/update", AuthMiddleware, UpdateStatusApi);

export default applicationRoutes;
