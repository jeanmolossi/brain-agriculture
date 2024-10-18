import ApiError from "@/config/errors/error";
import FarmerRepository from "@/repositories/farmer";
import { Farmer, Farming } from "@/types/entities";

export default class UpdateFarmer {
  static make() {
    const repository = FarmerRepository.make();

    return new UpdateFarmer(repository);
  }

  constructor(private readonly repository: FarmerRepository) {}

  async execute(farmerID: number, farmer: Farmer) {
    farmer.document = this.#sanitizeDocument(farmer.document);

    try {
      if (!this.#isAllowedAreas(farmer.farm_usable_area, farmer.farmings)) {
        throw new ApiError(
          "farming areas should be lower than farm usable area available",
          400,
        );
      }

      return await this.repository.updateFarmer(farmerID, farmer);
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }

      // 23505 is unique violation code from postgresql
      if ("code" in err && err.code === "23505") {
        switch (err.table) {
          case "farmers":
            throw new ApiError("this farmer already exists", 409);
          case "farms":
            throw new ApiError("this farm already exists", 409);
          case "farmings":
            throw new ApiError("this farmings already exists", 409);
          default:
            throw new ApiError("unknown unique constraint violation");
        }
      }

      throw new ApiError(err.message, 409);
    }
  }

  #sanitizeDocument(document: string): string {
    return document.replace(/[.-\s\/]+/g, "");
  }

  #isAllowedAreas(maxArea: number, farmings: Farming[]): boolean {
    const farmingAreas = farmings.reduce(
      (acc, farming) => (acc += farming.area),
      0,
    );

    return maxArea >= farmingAreas;
  }
}
