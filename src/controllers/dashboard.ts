import FarmTotals from "@/services/farm-totals";
import GraphByFarming from "@/services/graph-by-farming";
import GraphByGround from "@/services/graph-by-ground";
import GraphByState from "@/services/graph-by-state";
import type { Request, Response } from "express";

export default class DashboardController {
  static make() {
    const farmTotals = FarmTotals.make();
    const graphByState = GraphByState.make();
    const graphByGround = GraphByGround.make();
    const graphByFarming = GraphByFarming.make();

    return new DashboardController(
      farmTotals,
      graphByState,
      graphByGround,
      graphByFarming,
    );
  }

  constructor(
    private readonly farmTotals: FarmTotals,
    private readonly graphByState: GraphByState,
    private readonly graphByGround: GraphByGround,
    private readonly graphByFarming: GraphByFarming,
  ) {}

  async get(_request: Request, response: Response) {
    const [farms, by_state, by_ground, by_farming] = await Promise.all([
      this.farmTotals.execute(),
      this.graphByState.execute(),
      this.graphByGround.execute(),
      this.graphByFarming.execute(),
    ]);

    response.status(200).json({ farms, by_state, by_ground, by_farming });
  }
}
