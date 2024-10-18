import request from "supertest";
import knex from "knex";
import { MockClient, Tracker, createTracker } from "knex-mock-client";
import application from "@/application/app";
import { Farmer } from "@/types/entities";
import db from "@/config/database";

jest.mock("@/config/database", () =>
  knex({ client: MockClient, dialect: "pg" }),
);

const mockAgent = request.agent(application.app);

describe("Farmer Controller", () => {
  describe("given complete payload of farmer with relationships while creating", () => {
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

      tracker.on.insert("farmer").response([{ id: 1 }]);
      tracker.on.insert("farm").response([{ id: 1 }]);
      tracker.on.insert("farmings").response([{ id: 1 }]);
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
        farmer: { id: 1 },
        farm: { id: 1 },
        farmings: [{ id: 1 }],
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

  // UPDATE

  describe("given complete payload of farmer with relationships while updating", () => {
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

      tracker.on.update("farmers").response([{ id: 1 }]);
      tracker.on.update("farms").response([{ id: 1 }]);
      tracker.on.delete("farmings").response([]);
      tracker.on.insert("farmings").response([{ id: 1 }]);
    });

    afterEach(() => {
      tracker.reset();
    });

    it("should return 200 and the farmer must to be updated", async () => {
      const response = await mockAgent
        .put("/brain/v1/farmer/1")
        .set("content-type", "application/json")
        .send(farmer);

      expect(response.body).toStrictEqual({
        farmer: { id: 1 },
        farm: { id: 1 },
        farmings: [{ id: 1 }],
      });
      expect(response.status).toBe(200);
    });

    it("should return 400 when farmings areas greather than usable area", async () => {
      farmer.farm_usable_area = 7;

      const response = await mockAgent
        .put("/brain/v1/farmer/1")
        .set("content-type", "application/json")
        .send(farmer);

      expect(response.body).toStrictEqual({
        error: "farming areas should be lower than farm usable area available",
        status_code: 400,
      });

      expect(response.status).toBe(400);
    });
  });

  // DELETE

  describe("given farmer id", () => {
    let tracker: Tracker;

    beforeEach(() => {
      // @ts-ignore
      tracker = createTracker(db);
    });

    afterEach(() => {
      tracker.reset();
    });

    it("should return 204 when the farmer was deleted", async () => {
      tracker.on.delete("farmers").response([1]);

      const response = await mockAgent
        .delete("/brain/v1/farmer/1")
        .set("content-type", "application/json")
        .send();

      expect(response.status).toBe(204);
    });

    it("should return 404 when farmer does not exists", async () => {
      tracker.on.delete("farmers").response([]);

      const response = await mockAgent
        .delete("/brain/v1/farmer/1")
        .set("content-type", "application/json")
        .send();

      expect(response.body).toStrictEqual({
        error: "farmer was not found",
        status_code: 404,
      });

      expect(response.status).toBe(404);
    });
  });
});
