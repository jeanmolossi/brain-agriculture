import { ValidationError } from "@/types/validation-error";

export default class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly errors?: ValidationError[],
  ) {
    super(message);
  }
}
