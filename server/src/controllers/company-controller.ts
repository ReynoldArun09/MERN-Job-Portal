import { type Request, type Response } from "express";
import { AppError, AsyncWrapper } from "../utils";
import { Company } from "../models";
import {
  ApiErrorMessages,
  ApiSuccessMessages,
  HttpStatusCode,
} from "../constants";

export const RegisterCompanyApi = AsyncWrapper(
  async (req: Request, res: Response) => {
    const { companyName } = req.body;
    const userId = req.user._id;
    const existingCompany = await Company.findOne({ name: companyName });

    if (existingCompany) {
      throw new AppError(
        ApiErrorMessages.COMPANY_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const newCompany = await Company.create({
      name: companyName,
      userId,
    });

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      data: newCompany,
      message: ApiSuccessMessages.COMPANY_CREATED,
    });
  }
);

export const GetCompanyApi = AsyncWrapper(
  async (req: Request, res: Response) => {
    const userId = req.user._id;

    const existingCompanies = await Company.find({ userId });

    if (!existingCompanies) {
      throw new AppError(
        ApiErrorMessages.COMPANY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }
    res.status(HttpStatusCode.CREATED).json({
      success: true,
      data: existingCompanies,
    });
  }
);

export const GetCompanyByIdApi = AsyncWrapper(
  async (req: Request, res: Response) => {
    const companyId = req.params.id;

    const existingCompany = await Company.findById(companyId);

    if (!existingCompany) {
      throw new AppError(
        ApiErrorMessages.COMPANY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }
    res.status(HttpStatusCode.CREATED).json({
      success: true,
      data: existingCompany,
    });
  }
);

// TODO: UPDATE API
