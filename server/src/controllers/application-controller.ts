import { type Request, type Response } from "express";
import { AsyncWrapper } from "../utils";
import { Application, Job } from "../models";
import {
  ApiErrorMessages,
  ApiSuccessMessages,
  HttpStatusCode,
} from "../constants";

export const ApplyJobApi = AsyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const jobId = req.params.id;

  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: userId,
  });

  if (!existingApplication) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      success: false,
      message: ApiErrorMessages.APPLICATION_ALREADY_EXISTS,
    });
  }

  const existingJob = await Job.findById(jobId);

  if (!existingJob) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      success: false,
      message: ApiErrorMessages.JOB_NOT_FOUND,
    });
  }

  const newApplication = await Application.create({
    job: jobId,
    applicant: userId,
  });

  existingJob?.applications.push(newApplication._id);
  await existingJob.save();

  res.status(HttpStatusCode.CREATED).json({
    success: true,
    message: ApiSuccessMessages.JOB_APPLICATION_CREATED,
  });
});

export const GetAppliedJobsApi = AsyncWrapper(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    const existingApplication = await Application.find({ applicant: userId })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });

    if (!existingApplication) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: ApiErrorMessages.APPLICATION_ALREADY_EXISTS,
      });
    }

    res.status(HttpStatusCode.OK).json({
      success: true,
      data: existingApplication,
    });
  }
);

export const GetApplicantsApi = AsyncWrapper(
  async (req: Request, res: Response) => {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: ApiErrorMessages.JOB_NOT_FOUND,
      });
    }
    res.status(HttpStatusCode.OK).json({
      success: true,
      data: job,
    });
  }
);

export const UpdateStatusApi = AsyncWrapper(
  async (req: Request, res: Response) => {
    const { status } = req.body;
    const applicationId = req.params.id;

    const existingApplication = await Application.findOne({
      _id: applicationId,
    });

    if (!existingApplication) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
      });
    }

    existingApplication.status = status.toLowerCase();
    await existingApplication.save();

    return res.status(HttpStatusCode.OK).json({
      message: "Status updated",
      success: true,
    });
  }
);
