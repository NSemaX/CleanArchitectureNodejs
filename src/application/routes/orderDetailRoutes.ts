import express from "express";
import { Types } from "../../infrastructure/utility/DiTypes";
import { dIContainer } from "../../inversify.config";
import { IOrderDetailController } from "../controllers/orderDetailController";

class OrderDetailRoutes {
  router = express.Router();
  OrderDetailController = dIContainer.get<IOrderDetailController>(
    Types.ORDER_DETAIL_CONTROLLER
  );
  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {

    // Retrieve all OrderDetails
    this.router.get("/", this.OrderDetailController.getAllOrderDetails);

    // Retrieve a single OrderDetail with id
    this.router.get("/:id", this.OrderDetailController.getOrderDetailById);

    // Create a new OrderDetail
    this.router.post("/", this.OrderDetailController.createOrderDetail);

    // Update a OrderDetail with id
    this.router.put("/:id", this.OrderDetailController.updateOrderDetail);

    // Delete a OrderDetail with id
    this.router.delete("/:id", this.OrderDetailController.deleteOrderDetail);

  }
}

export default new OrderDetailRoutes().router;