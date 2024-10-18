import pg from "@/config/database";
import ApiError from "@/config/errors/error";
import { Farmer } from "@/types/entities";
import { Knex } from "knex";

export default class FarmerRepository {
  static make() {
    return new FarmerRepository(pg);
  }

  private constructor(private db: Knex) {}

  async createFarmer(farmer: Farmer) {
    return this.db.transaction(async (trx) => {
      const _farmer = await trx
        .insert(
          {
            name: farmer.name,
            document: farmer.document,
            doc_type: farmer.document.length == 11 ? "CPF" : "CNPJ",
          },
          "id",
        )
        .into("farmers")
        .then((farmers) => farmers.at(0))
        .catch(trx.rollback);

      const usableArea = farmer.farmings.reduce((acc, f) => (acc += f.area), 0);

      const farms = await trx
        .insert(
          {
            name: farmer.farm_name,
            city: farmer.city,
            state: farmer.state,
            total_area: farmer.farm_total_area,
            max_usable_area: farmer.farm_usable_area,
            usable_inuse_area: usableArea,
            farmer_id: _farmer.id,
          },
          "id",
        )
        .into("farms")
        .then((farms) => farms.at(0))
        .catch(trx.rollback);

      const farmingValues = farmer.farmings.map((farming) => ({
        farming_type: farming.type,
        area: farming.area,
        farm_id: farms.id,
      }));

      const farmings = await trx
        .insert(farmingValues, "id")
        .into("farmings")
        .catch(trx.rollback);

      await trx.commit({
        farmer: _farmer,
        farm: farms,
        farmings,
      });

      return {
        ..._farmer,
        farm: {
          ...farms,
          farmings,
        },
      };
    });
  }

  async getFarmerByID(id: number) {
    const farmers = await pg.from("farmers").where("id", "=", id);

    const farmer = farmers.at(0);

    if (!farmer) {
      throw new ApiError("farmer not found", 404);
    }

    return farmer;
  }
}
