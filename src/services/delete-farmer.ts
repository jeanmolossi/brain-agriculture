import ApiError from "@/config/errors/error";
import FarmerRepository from "@/repositories/farmer";

export default class DeleteFarmer {
  static make() {
    const repository = FarmerRepository.make();
    return new DeleteFarmer(repository);
  }

  constructor(private readonly repository: FarmerRepository) {}

  async execute(farmerID: number) {
    const deleted = await this.repository.deleteFarmer(farmerID);
    if (deleted === 0) {
      throw new ApiError("farmer was not found", 404);
    }
  }
}
