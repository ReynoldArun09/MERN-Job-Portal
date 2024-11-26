export type JWTPayloadType = {
  _id: ObjectId;
  fullname: string;
  email: string;
  role: "student" | "recruiter";
};

declare global {
  namespace Express {
    interface Request {
      user: JWTPayloadType;
    }
  }
}
