import { Document, ObjectId } from "mongoose";

interface Profile {
  bio: string;
  skills: string;
  resume: string;
  resumeOriginalName: string;
  company: ObjectId;
  profilePhoto: string;
}

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: "student" | "recruiter";
  profile: Profile;
}

export interface IJob extends Document {
  title: string;
  description: string;
  requirements: string[];
  salary: number;
  experienceLevel: number;
  location: string;
  jobType: string;
  position: number;
  company: ObjectId;
  createdBy: ObjectId;
  applications: Application[];
}

export interface ICompany extends Document {
  name: string;
  location: string;
  description: string;
  logo: string;
  website: string;
  userId: ObjectId;
}

export interface IApplication extends Document {
  job: ObjectId;
  applicant: ObjectId;
  status: "pending" | "accepted" | "rejected";
}
