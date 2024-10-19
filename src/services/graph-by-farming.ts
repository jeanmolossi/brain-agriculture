import FarmingRepository from "@/repositories/farming";

export default class GraphByFarming {
  static make() {
    const repository = FarmingRepository.make();

    return new GraphByFarming(repository);
  }

  constructor(private readonly repository: FarmingRepository) {}

  async execute() {
    const farmings = await this.repository.filterByFarmings().catch(() => ({
      error: "unable to retrieve totals by farmings",
    }));

    if ("error" in farmings) {
      return farmings.error;
    }

    const byFarmings = farmings.reduce(
      (acc, farming) => {
        const type = `${farming.farming_type}`
          .toLowerCase()
          .replace(/[\s-]+/g, "_");

        const total = parseInt(`${farming.count}`);

        acc.all.total += total;

        acc[type] = {
          type: farming.farming_type,
          total,
        };

        return acc;
      },
      { all: { total: 0, percentage: 1 } } as Record<string, any>,
    );

    const total = byFarmings.all.total;
    for (let [farming, values] of Object.entries(byFarmings)) {
      if (farming === "all") continue;

      byFarmings[farming].percentage = values.total / total;
    }

    return byFarmings;
  }
}
