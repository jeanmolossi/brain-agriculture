import FarmRepository from "@/repositories/farm";

export default class GraphByState {
  static make() {
    const repository = FarmRepository.make();
    return new GraphByState(repository);
  }

  constructor(private readonly repository: FarmRepository) {}

  async execute() {
    const byStatePromise = await this.repository.filterByState().catch(() => ({
      error: "unable to retrieve totals by state",
    }));

    if ("error" in byStatePromise) {
      return byStatePromise.error;
    }

    const states = byStatePromise.reduce(
      (acc, state) => {
        const stateSlug = `${state.state}`
          .toLowerCase()
          .replace(/[\s-]+/g, "_");

        const total = parseInt(`${state.count}`);
        acc.all.total += total;

        acc[stateSlug] = {
          state: state.state,
          total,
        };

        return acc;
      },
      { all: { total: 0, percentage: 1 } } as Record<string, any>,
    );

    const total = states.all.total;
    for (let [state, values] of Object.entries(states)) {
      if (state === "all") continue;

      states[state].percentage = values.total / total;
    }

    return states;
  }
}
