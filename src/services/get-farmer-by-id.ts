import FarmerRepository from "@/repositories/farmer";

export default class GetFarmerByID {
  static make() {
    const repository = FarmerRepository.make();

    return new GetFarmerByID(repository);
  }

  constructor(private readonly repository: FarmerRepository) {}

  async execute(id: number) {
    return this.repository.getFarmerByID(id);
  }
}
