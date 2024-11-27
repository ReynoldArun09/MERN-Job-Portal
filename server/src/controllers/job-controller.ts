import { type Request, type Response } from "express";
import { AppError, AsyncWrapper } from "../utils";
import { Job } from "../models";
import { JobSchemaType } from "../schemas/job-schema";
import {
  ApiErrorMessages,
  ApiSuccessMessages,
  HttpStatusCode,
} from "../constants";

export const PostJobApi = AsyncWrapper(
  async (req: Request<{}, {}, JobSchemaType>, res: Response) => {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel,
      position,
      companyId,
    } = req.body;
    const userId = req.user._id;

    const job = await Job.create({
      title,
      description,
      location,
      jobType,
      experienceLevel,
      requirements: requirements.split(","),
      salary: Number(salary),
      position,
      company: companyId,
      createdBy: userId,
    });
    return res.status(HttpStatusCode.CREATED).json({
      message: ApiSuccessMessages.JOB_CREATED,
      data: job,
      success: true,
    });
  }
);

export const GetAllJobsApi = AsyncWrapper(
  async (req: Request, res: Response) => {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    if (!jobs) {
      throw new AppError(
        ApiErrorMessages.JOB_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }
    res.status(HttpStatusCode.OK).json({
      data: jobs,
      success: true,
    });
  }
);

export const GetJobByIdApi = AsyncWrapper(
  async (req: Request, res: Response) => {
    const jobId = req.params.id;
    const existingJob = await Job.findById(jobId).populate({
      path: "applications",
    });

    if (!existingJob) {
      throw new AppError(
        ApiErrorMessages.JOB_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }
    res.status(HttpStatusCode.OK).json({
      success: true,
      data: existingJob,
    });
  }
);

export const GetAdminJobsApi = AsyncWrapper(
  async (req: Request, res: Response) => {
    const adminId = req.user._id;
    const existingJobs = await Job.find({ created_by: adminId })
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!existingJobs) {
      throw new AppError(
        ApiErrorMessages.JOB_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }
    res.status(HttpStatusCode.OK).json({
      success: true,
      data: existingJobs,
    });
  }
);
