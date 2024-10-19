import pg from "@/config/database";
import { Knex } from "knex";

export default class FarmRepository {
  static make() {
    return new FarmRepository(pg);
  }

  private constructor(private readonly db: Knex) {}

  async countFarm() {
    const count = await this.db("farms").count("*");
    return parseInt(`${count.at(0)?.count}`);
  }

  async sumFarmAreaTotal() {
    const sum = await this.db("farms").sum("total_area");
    return parseInt(`${sum.at(0)?.sum}`);
  }

  async filterByState() {
    const states = await this.db("farms")
      .select("state")
      .count("*")
      .groupBy("state");

    return states;
  }

  async filterByGround() {
    const sum = await this.db("farms")
      .sum("total_area as total_area")
      .sum("max_usable_area as usable_area")
      .first();

    const sum2 = await this.db("farmings").sum("area as area").first();

    return {
      ...sum,
      ...sum2,
    };
  }
}
