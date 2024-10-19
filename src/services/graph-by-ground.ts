import FarmRepository from "@/repositories/farm";

export default class GraphByGround {
  static make() {
    const repository = FarmRepository.make();

    return new GraphByGround(repository);
  }

  constructor(private readonly repository: FarmRepository) {}

  async execute() {
    const totals = await this.repository.filterByGround();

    const maxFarmingArea = parseInt(`${totals?.usable_area || 0}`);
    const allArea = parseInt(`${totals?.total_area || 0}`);
    const farmingArea = parseInt(`${totals?.area || 0}`);

    const unableFarmArea = allArea - maxFarmingArea;
    const farmingAreaWithVegetation = maxFarmingArea - farmingArea;
    const vegetationTotal = unableFarmArea + farmingAreaWithVegetation;

    return {
      vegetation: {
        area: vegetationTotal,
        percentage: vegetationTotal / allArea,
      },
      farming: {
        area: farmingArea,
        percentage: farmingArea / allArea,
      },
      total: {
        area: allArea,
        percentage: 1,
      },
    };
  }
}
