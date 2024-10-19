import pg from "@/config/database";
import { Knex } from "knex";

export default class FarmingRepository {
  static make() {
    return new FarmingRepository(pg);
  }

  constructor(private readonly db: Knex) {}

  async filterByFarmings() {
    const sum = await this.db("farmings")
      .select("farming_type")
      .count("farming_type")
      .groupBy("farming_type");

    return sum;
  }
}
