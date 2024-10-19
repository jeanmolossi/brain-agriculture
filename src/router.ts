import { Router } from "express";
import FarmerController from "./controllers/farmer";
import createFarmerValidation from "./middlewares/create-farmer-validator";
import DashboardController from "./controllers/dashboard";

export class FarmerRouter {
  static make() {
    const controller = FarmerController.make();

    return Router()
      .get("/", controller.get.bind(controller))
      .post("/", createFarmerValidation, controller.store.bind(controller))
      .get("/:farmer_id", controller.fetch.bind(controller))
      .put(
        "/:farmer_id",
        createFarmerValidation,
        controller.update.bind(controller),
      )
      .delete("/:farmer_id", controller.delete.bind(controller));
  }
}

export class DashboardRouter {
  static make() {
    const controller = DashboardController.make();

    return Router().get("/", controller.get.bind(controller));
  }
}
