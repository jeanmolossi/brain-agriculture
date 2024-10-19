import FarmRepository from "@/repositories/farm";

export default class FarmTotals {
  static make() {
    const repository = FarmRepository.make();

    return new FarmTotals(repository);
  }

  constructor(private readonly repository: FarmRepository) {}

  async execute() {
    const totalPromise = this.repository
      .countFarm()
      .catch(() => "unable to retrieve total of farms");

    const totalAreaPromise = this.repository
      .sumFarmAreaTotal()
      .catch(() => "unable to retrieve total area");

    return {
      total: await totalPromise,
      area: await totalAreaPromise,
    };
  }
}
