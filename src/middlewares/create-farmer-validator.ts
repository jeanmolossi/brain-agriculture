import type { Request, Response, NextFunction } from "express";
import { assert, StructError } from "superstruct";
import ApiError from "@/config/errors/error";
import farmerSchema from "@/validations/create-farmer-schema";
import { ValidationError } from "@/types/validation-error";

export default async function createFarmerValidation(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  try {
    assert(request.body, farmerSchema);
  } catch (error) {
    if (!(error instanceof StructError)) {
      throw new ApiError("failed to register data", 422);
    }

    const errors: ValidationError[] = [];

    for (const failure of error.failures()) {
      const errorObj: ValidationError = {
        path: failure.path.join("."),
        type: failure.type,
        message: failure.message,
      };

      errors.push(errorObj);
    }

    throw new ApiError(`failed to register data`, 400, errors);
  }

  next();
}
