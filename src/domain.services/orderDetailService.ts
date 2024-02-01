import { inject, injectable } from "inversify";
import OrderDetail, { OrderDetailRequest, OrderDetailResponse } from "../domain/models/orderDetail";
import { Types } from "../infrastructure/utility/DiTypes";
import { IOrderDetailRepository } from "../infrastructure/repositories/orderDetailRepository";

export interface IOrderDetailService {

  getOrderDetailById: (Id: number) => Promise<OrderDetailResponse>;
  getAllOrderDetails: () => Promise<Array<OrderDetailResponse>>;
  createOrderDetail: (OrderDetail: OrderDetailRequest) => Promise<any>;
  updateOrderDetail: (Id: number, OrderDetail: OrderDetailRequest) => Promise<number>;
  deleteOrderDetail: (Id: number) => Promise<boolean>;
}

@injectable()
export class OrderDetailService implements IOrderDetailService {
  @inject(Types.ORDER_DETAIL_REPOSITORY)
  private OrderDetailRepository: IOrderDetailRepository;



  getAllOrderDetails = async (): Promise<Array<OrderDetailResponse>> => {
    try {
      return this.OrderDetailRepository.getAll();
    } catch {
      throw new Error("Unable to get OrderDetails");
    }
  };

  getOrderDetailById = async (Id: number): Promise<OrderDetailResponse> => {
    try {
      return this.OrderDetailRepository.getById(Id);
    } catch {
      throw new Error("Unable to get OrderDetail");
    }
  };

  createOrderDetail = async (OrderDetail: OrderDetailRequest): Promise<any> => {
    try {
      return this.OrderDetailRepository.create(OrderDetail);
    } catch (ex) {
      throw new Error("Unable to create OrderDetail");
    }
  };

  updateOrderDetail = async (Id: number, OrderDetail: OrderDetailRequest): Promise<number> => {
    try {
      return this.OrderDetailRepository.update(Id, OrderDetail);
    } catch {
      throw new Error("Unable to updated OrderDetail");
    }
  };

  deleteOrderDetail = async (Id: number,): Promise<boolean> => {
    try {
      return this.OrderDetailRepository.delete(Id);
    } catch {
      throw new Error("Unable to delete OrderDetail");
    }
  };
}

