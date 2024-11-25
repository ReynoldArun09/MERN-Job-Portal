import request from "supertest";
import app from "../app";
import { User } from "../models";
import { ApiErrorMessages, ApiSuccessMessages } from "../constants";
import { SignInSchemaType, SignUpSchemaType } from "../schemas/auth-schema";
import bcrypt from "bcryptjs";

jest.mock("../models/user-model");
jest.mock("bcryptjs");

describe("Auth controller testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Signup api", () => {
    it("should return 400 status if user already exist in db", async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce({});
      const response = await request(app).post("/api/v1/auth/signup");
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(ApiErrorMessages.USER_ALREADY_EXISTS);
    });
    it("should create new user", async () => {
      const mockUser: SignUpSchemaType = {
        fullname: "mock fullname",
        email: "mock email",
        password: "mock password",
        phoneNumber: 1234567890,
        role: "student",
        photo: "mock photo",
      };
      (User.findOne as jest.Mock).mockResolvedValueOnce(null);
      (User.create as jest.Mock).mockResolvedValueOnce(mockUser);
      const response = await request(app)
        .post("/api/v1/auth/signup")
        .send(mockUser);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe(ApiSuccessMessages.USER_CREATED);
    });
  });
  describe("Signin api", () => {
    it("should return 400 status if user doesnt exist in db", async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce(null);
      const response = await request(app).post("/api/v1/auth/signin");
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(ApiErrorMessages.USER_NOT_FOUND);
    });
    it("should return 400 status if password is incorrect", async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce({});
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      const response = await request(app).post("/api/v1/auth/signin");
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(ApiErrorMessages.USER_NOT_FOUND);
    });
    it("should login user", async () => {
      const mockUser: SignInSchemaType = {
        email: "mock email",
        password: "mock password",
        role: "student",
      };
      (User.findOne as jest.Mock).mockResolvedValueOnce({});
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      const response = await request(app)
        .post("/api/v1/auth/signin")
        .send(mockUser);
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(ApiSuccessMessages.USER_LOGGED_IN);
    });
  });

  describe("Signout api", () => {
    it("should signout user", async () => {
      const response = await request(app).post("/api/v1/auth/signout");
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(ApiSuccessMessages.USER_LOGGED_OUT);
      expect(response.header["access-token"]).toBeUndefined();
    });
  });
});
