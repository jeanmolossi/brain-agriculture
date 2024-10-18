import { Router } from "express";
import FarmerController from "./controllers/farmer";
import createFarmerValidation from "./middlewares/create-farmer-validator";

export default class FarmerRouter {
  static make() {
    const controller = FarmerController.make();

    return Router()
      .get("/", controller.get.bind(controller))
      .post("/", createFarmerValidation, controller.store.bind(controller))
      .get("/:farmer_id", controller.fetch.bind(controller))
      .put("/:farmer_id", controller.update.bind(controller));
  }
}
