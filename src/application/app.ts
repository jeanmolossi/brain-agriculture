import "express-async-errors";
import express, { Application, Router } from "express";
import errorHandler from "@/config/middlewares/error";
import FarmerRouter from "@/router";

class App {
  public readonly app: Application;

  constructor() {
    this.app = express();
    this.#middlewares();
    this.#router();
    this.#errorHandler();
  }

  #middlewares() {
    this.app.use(express.json());
  }

  #router() {
    const router = Router();
    const version = Router();

    const farmer = FarmerRouter.make();
    router.use("/farmer", farmer);

    this.app.use(version.use("/brain/v1", router));
  }

  #errorHandler() {
    this.app.use(errorHandler);
  }
}

export default new App();
