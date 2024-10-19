import request from "supertest";
import knex from "knex";
import { createTracker, MockClient, Tracker } from "knex-mock-client";
import db from "@/config/database";
import application from "@/application/app";

jest.mock("@/config/database", () =>
  knex({ client: MockClient, dialect: "pg" }),
);

const mockAgent = request.agent(application.app);

describe("Dashboard Controller", () => {
  describe("given a request of dashboard", () => {
    let tracker: Tracker;

    beforeEach(() => {
      tracker = createTracker(db);

      tracker.on
        .select(`select sum("total_area") from "farms"`)
        .response([{ sum: "1000" }]);

      tracker.on
        .select(
          `select sum("total_area") as "total_area", sum("max_usable_area") as "usable_area" from "farms" limit $1`,
        )
        .response([
          {
            total_area: "1000",
            usable_area: "600",
          },
        ]);

      tracker.on
        .select(
          `select "farming_type", count("farming_type") from "farmings" group by "farming_type"`,
        )
        .response([
          {
            farming_type: "Milho",
            count: "5",
          },
          {
            farming_type: "Mandioca",
            count: "30",
          },
          {
            farming_type: "Cafe",
            count: "10",
          },
          {
            farming_type: "Cana",
            count: "15",
          },
          {
            farming_type: "Soja",
            count: "30",
          },
        ]);

      tracker.on
        .select(`select sum("area") as "area" from "farmings" limit $1`)
        .response([
          {
            area: "600",
          },
        ]);

      tracker.on
        .select(`select "state", count("1") from "farms" group by "state"`)
        .response([
          {
            state: "Goias",
            count: "45",
          },
          {
            state: "Rio Grande do Sul",
            count: "45",
          },
          {
            state: "Parana",
            count: "10",
          },
          {
            state: "Bahia",
            count: "0",
          },
        ]);

      tracker.on
        .select(`select count(*) from "farms"`)
        .response([{ count: "100" }]);
    });

    afterEach(() => {
      tracker.reset();
    });

    it("should get all data correctly", async () => {
      const response = await mockAgent
        .get("/brain/v1/dashboard")
        .set("content-type", "application/json")
        .send();

      expect(response.body).toStrictEqual({
        farms: {
          total: 100,
          area: 1000,
        },
        by_farming: {
          all: {
            percentage: 1,
            total: 90,
          },
          cafe: {
            type: "Cafe",
            total: 10,
            percentage: 10 / 90,
          },
          cana: {
            type: "Cana",
            total: 15,
            percentage: 15 / 90,
          },
          mandioca: {
            type: "Mandioca",
            total: 30,
            percentage: 30 / 90,
          },
          milho: {
            type: "Milho",
            total: 5,
            percentage: 5 / 90,
          },
          soja: {
            type: "Soja",
            total: 30,
            percentage: 30 / 90,
          },
        },
        by_ground: {
          total: {
            area: 1000,
            percentage: 1,
          },
          farming: {
            area: 600,
            percentage: 0.6,
          },
          vegetation: {
            area: 400,
            percentage: 0.4,
          },
        },
        by_state: {
          all: {
            total: 100,
            percentage: 1,
          },
          goias: {
            state: "Goias",
            total: 45,
            percentage: 45 / 100,
          },
          rio_grande_do_sul: {
            state: "Rio Grande do Sul",
            total: 45,
            percentage: 45 / 100,
          },
          parana: {
            state: "Parana",
            total: 10,
            percentage: 10 / 100,
          },
          bahia: {
            state: "Bahia",
            total: 0,
            percentage: 0,
          },
        },
      });
      expect(response.status).toBe(200);
    });

    it("should fail if some query was failed", async () => {
      tracker.reset();

      tracker.on.select("farms").simulateError("query farms was failed");

      const response = await mockAgent
        .get("/brain/v1/dashboard")
        .set("content-type", "application/json")
        .send();

      expect(response.body).toStrictEqual({
        by_farming: "unable to retrieve totals by farmings",
        by_ground: "unable to retrieve totals by ground",
        by_state: "unable to retrieve totals by state",
        farms: {
          total: "unable to retrieve total of farms",
          area: "unable to retrieve total area",
        },
      });
      expect(response.status).toBe(200);
    });
  });
});
