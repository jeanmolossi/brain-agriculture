import request from "supertest";
import knex from "knex";
import { MockClient, Tracker, createTracker } from "knex-mock-client";
import application from "@/application/app";
import { Farmer } from "@/types/entities";
import db from "@/config/database";

jest.mock("@/config/database", () => knex({ client: MockClient }));

const mockAgent = request.agent(application.app);

describe("Farmer Controller", () => {
  describe("given complete payload of farmer with relationships", () => {
    let farmer: Farmer;
    let tracker: Tracker;

    beforeEach(() => {
      // @ts-ignore
      tracker = createTracker(db);

      farmer = {
        name: "Vicente",
        document: "66.395.412/0001-86",
        farm_name: "Fazenda Talisma",
        farm_total_area: 10,
        farm_usable_area: 8,
        city: "Goiania",
        state: "Goias",
        farmings: [
          {
            type: "Mandioca",
            area: 8,
          },
        ],
      };

      tracker.on.insert("farmer").response([1]);
      tracker.on.insert("farm").response([1]);
      tracker.on.insert("farmings").response([1]);
    });

    afterEach(() => {
      tracker.reset();
    });

    it("should return 201 and the farmer must to be created", async () => {
      const response = await mockAgent
        .post("/brain/v1/farmer")
        .set("content-type", "application/json")
        .send(farmer);

      expect(response.body).toStrictEqual({
        farmer: 1,
        farm: 1,
        farmings: [1],
      });
      expect(response.status).toBe(201);
    });

    it("should return 400 when farmings areas greather than usable area", async () => {
      farmer.farm_usable_area = 7;

      const response = await mockAgent
        .post("/brain/v1/farmer")
        .set("content-type", "application/json")
        .send(farmer);

      expect(response.body).toStrictEqual({
        error: "farming areas should be lower than farm usable area available",
        status_code: 400,
      });

      expect(response.status).toBe(400);
    });

    it("should return 409 when farmer already exists", async () => {
      const error = new Error();
      // @ts-ignore
      error.code = "23505";
      // @ts-ignore
      error.table = "farmers";

      tracker.reset();
      tracker.on.insert("farmer").simulateErrorOnce(error);

      const response = await mockAgent
        .post("/brain/v1/farmer")
        .set("content-type", "application/json")
        .send(farmer);

      expect(response.body).toStrictEqual({
        error: "this farmer already exists",
        status_code: 409,
      });

      expect(response.status).toBe(409);
    });
  });
});
