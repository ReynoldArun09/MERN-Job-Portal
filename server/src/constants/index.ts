export enum GlobalSuccessMessages {
  DEV_SERVER_STARTED = "Development server started successfully",
  SERVER_STARTED = "Server started successfully",
  MONGO_CONNECTION_SUCCESS = "MongoDB connected successfully",
}
export enum GlobalErrorMessages {
  DEV_SERVER_FAILED_TO_START = "Failed to start development server",
  SERVER_FAILED_TO_START = "Failed to start server",
  ENV_PARSE_ERROR = "Error parsing environment variables:",
  ROUTE_NOT_FOUND = "Route not found",
  MONGO_ENV_NOT_DEFINED = "MONGO_DB_URI environment variable not defined",
  MONGO_CONNECTION_ERROR = "MongoDB connection error: ",
  INVALID_ID = "The ID you entered is invalid.",
  INTERNAL_SERVER_ERROR = "Oops! Something went wrong. Please try again later.",
  UNAUTHORIZED = "You are not authorized to perform this action.",
}

export enum ValidationMessages {
  MONGO_DB_URI_REQUIRED = "MongoDB URI is required",
  ACCESS_TOKEN_SECRET_LENGTH = "Access token secret must be at least 10 characters",
  CORS_ORIGIN_REQUIRED = "CORS Origin must be provided",
  CLOUDINARY_CLOUD_NAME_REQUIRED = "Cloudinary Cloud Name is required",
  CLOUDINARY_API_KEY_REQUIRED = "Cloudinary API Key is required",
  CLOUDINARY_API_SECRET_REQUIRED = "Cloudinary API Secret is required",
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

export enum ApiSuccessMessages {
  USER_CREATED = "User created successfully",
  USER_LOGGED_IN = "User logged in successfully",
  USER_LOGGED_OUT = "User logged out successfully",
}

export enum ApiErrorMessages {
  USER_ALREADY_EXISTS = "User already exists",
  USER_NOT_FOUND = "User not found",
  INVALID_TOKEN = "The token you entered is invalid. Please try again.",
}
