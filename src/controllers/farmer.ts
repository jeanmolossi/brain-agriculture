import type { Request, Response } from "express";
import { create } from "superstruct";
import GetFarmerByID from "@/services/get-farmer-by-id";
import CreateFarmer from "@/services/create-farmer";
import farmerSchema from "@/validations/create-farmer-schema";
import UpdateFarmer from "@/services/update-farmer";
import ApiError from "@/config/errors/error";

export default class FarmerController {
  static make() {
    const getFarmerByID = GetFarmerByID.make();
    const createFarmer = CreateFarmer.make();
    const updateFarmer = UpdateFarmer.make();

    return new FarmerController(getFarmerByID, createFarmer, updateFarmer);
  }

  constructor(
    private readonly getFarmerByID: GetFarmerByID,
    private readonly createFarmer: CreateFarmer,
    private readonly updateFarmer: UpdateFarmer,
  ) {}

  async get(_request: Request, response: Response) {
    response.json({});
  }

  async fetch(request: Request, response: Response) {
    const id = parseInt(request.params.farmer_id);

    const farmer = await this.getFarmerByID.execute(id);

    response.json(farmer);
  }

  async store(request: Request, response: Response) {
    const farmerData = create(request.body, farmerSchema);
    const result = await this.createFarmer.execute(farmerData);
    response.status(201).json(result);
  }

  async update(request: Request, response: Response) {
    const farmerID = parseInt(request.params.farmer_id);

    if (isNaN(farmerID)) {
      throw new ApiError("resource id must be an valid integer", 400);
    }

    const farmerData = create(request.body, farmerSchema);
    const result = await this.updateFarmer.execute(farmerID, farmerData);
    response.json(result);
  }
}
