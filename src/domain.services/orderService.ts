import { inject, injectable } from "inversify";
import Order, { OrderRequest, OrderResponse } from "../domain/models/order";
import { Types } from "../infrastructure/utility/DiTypes";
import { IOrderRepository } from "../infrastructure/repositories/orderRepository";

export interface IOrderService {

  getOrderById: (Id: number) => Promise<OrderResponse>;
  getAllOrders: () => Promise<Array<OrderResponse>>;
  createOrder: (order: OrderRequest) => Promise<any>;
  updateOrder: (Id: number, order: OrderRequest) => Promise<number>;
  deleteOrder: (Id: number) => Promise<boolean>;
}

@injectable()
export class OrderService implements IOrderService {
  @inject(Types.ORDER_REPOSITORY)
  private orderRepository: IOrderRepository;



  getAllOrders = async (): Promise<Array<OrderResponse>> => {
    try {
      return this.orderRepository.getAll();
    } catch {
      throw new Error("Unable to get orders");
    }
  };

  getOrderById = async (Id: number): Promise<OrderResponse> => {
    try {
      return this.orderRepository.getById(Id);
    } catch {
      throw new Error("Unable to get order");
    }
  };

  createOrder = async (order: OrderRequest): Promise<any> => {
    try {
      return this.orderRepository.create(order);
    } catch (ex) {
      throw new Error("Unable to create order");
    }
  };

  updateOrder = async (Id: number, order: OrderRequest): Promise<number> => {
    try {
      return this.orderRepository.update(Id, order);
    } catch {
      throw new Error("Unable to updated order");
    }
  };

  deleteOrder = async (Id: number,): Promise<boolean> => {
    try {
      return this.orderRepository.delete(Id);
    } catch {
      throw new Error("Unable to delete order");
    }
  };
}

