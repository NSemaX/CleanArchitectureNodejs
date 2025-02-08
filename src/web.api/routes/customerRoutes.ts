import express from "express";
import { Types } from "../../infrastructure/utility/DiTypes";
import { dIContainer } from "../../inversify.config";
import { ICustomerController } from "../controllers/customerController";

class CustomerRoutes {
  router = express.Router();
  CustomerController = dIContainer.get<ICustomerController>(
    Types.CUSTOMER_CONTROLLER
  );
  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {

    // Retrieve all Customers
    this.router.get("/", this.CustomerController.getAllCustomers);

    // Retrieve a single Customer with id
    this.router.get("/:id", this.CustomerController.getCustomerById);

    // Create a new Customer
    this.router.post("/", this.CustomerController.createCustomer);

    // Update a Customer with id
    this.router.put("/", this.CustomerController.updateCustomer);

    // Delete a Customer with id
    this.router.delete("/:id", this.CustomerController.deleteCustomer);

  }
}

export default new CustomerRoutes().router;