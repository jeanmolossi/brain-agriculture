import type { Request, Response } from "express";
import { create } from "superstruct";
import GetFarmerByID from "@/services/get-farmer-by-id";
import CreateFarmer from "@/services/create-farmer";
import farmerSchema from "@/validations/create-farmer-schema";

export default class FarmerController {
  static make() {
    const getFarmerByID = GetFarmerByID.make();
    const createFarmer = CreateFarmer.make();

    return new FarmerController(getFarmerByID, createFarmer);
  }

  constructor(
    private readonly getFarmerByID: GetFarmerByID,
    private readonly createFarmer: CreateFarmer,
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
    response.json(result);
  }

  async update(_request: Request, response: Response) {
    response.json({ update: true });
  }
}
