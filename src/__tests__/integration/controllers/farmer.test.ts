import request from "supertest";
import application from "@/application/app";
import { Farmer } from "@/types/entities";

const mockAgent = request.agent(application.app);

describe("Farmer Controller", () => {
  describe("given complete payload of farmer with relationships", () => {
    let farmer: Farmer;

    beforeEach(() => {
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
    });

    it("should return 201 and the farmer must to be created", async () => {
      const response = await mockAgent
        .post("/brain/v1/farmer")
        .set("content-type", "application/json")
        .send(farmer);

      console.log(response.body);

      expect(response.body).toHaveProperty("farmer");
      expect(response.status).toBe(201);
    });
  });
});
