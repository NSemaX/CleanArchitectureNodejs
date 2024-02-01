import express from "express";
import { Types } from "../../infrastructure/utility/DiTypes";
import { dIContainer } from "../../inversify.config";
import { IOrderController } from "../controllers/orderController";

class OrderRoutes {
  router = express.Router();
  orderController = dIContainer.get<IOrderController>(
    Types.ORDER_CONTROLLER
  );
  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {

    // Retrieve all Orders
    this.router.get("/", this.orderController.getAllOrders);

    // Retrieve a single Order with id
    this.router.get("/:id", this.orderController.getOrderById);

    // Create a new Order
    this.router.post("/", this.orderController.createOrder);

    // Update a Order with id
    this.router.put("/:id", this.orderController.updateOrder);

    // Delete a Order with id
    this.router.delete("/:id", this.orderController.deleteOrder);

  }
}

export default new OrderRoutes().router;
