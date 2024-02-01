import { inject, injectable } from "inversify";
import Order, { OrderRequest, OrderResponse } from "../domain/models/order";
import { Types } from "../infrastructure/utility/DiTypes";
import { IOrderRepository } from "../infrastructure/repositories/orderRepository";
import orderAggregateResponse, { OrderDTO, OrderDetailDTO } from "../application/dtos/orderAggregateResponse";
import { OrderDetailResponse } from "../domain/models/orderDetail";
import { IOrderDetailRepository } from "../infrastructure/repositories/orderDetailRepository";
import { IProductRepository } from "../infrastructure/repositories/productRepository";
import { ICustomerRepository } from "../infrastructure/repositories/customerRepository";
import OrderAggregate from "../domain/aggregates/orderAggregate";
import orderAggregateRequest from "../application/dtos/orderAggregateRequest";

export interface IOrderAggregateService {

  getOrderAggreateById: (Id: number) => Promise<orderAggregateResponse>;
  createOrderAggreate: (orderAggregateRequest: orderAggregateRequest) => Promise<any>;
}

@injectable()
export class OrderAggregateService implements IOrderAggregateService {

  @inject(Types.ORDER_REPOSITORY)
  private orderRepository: IOrderRepository;

  @inject(Types.ORDER_DETAIL_REPOSITORY)
  private OrderDetailRepository: IOrderDetailRepository;

  @inject(Types.PRODUCT_REPOSITORY)
  private ProductRepository: IProductRepository;

  @inject(Types.CUSTOMER_REPOSITORY)
  private CustomerRepository: ICustomerRepository;

  getOrderAggreateById = async (Id: number): Promise<orderAggregateResponse> => {
    try {
      const orderAggregateResponseItem = new orderAggregateResponse();
      let orderItem = await this.orderRepository.getById(Id);
      let orderDetails: OrderDetailResponse[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID);
      orderAggregateResponseItem.OrderDetails = [];


      let OrderDTOItem = new OrderDTO();

      OrderDTOItem.ID = orderItem.ID;
      OrderDTOItem.Customer = await this.CustomerRepository.getById(orderItem.CustomerId);
      OrderDTOItem.TotalAmount = orderItem.TotalAmount;
      OrderDTOItem.Status = orderItem.Status
      OrderDTOItem.PurchasedDate = orderItem.PurchasedDate;

      let OrderDetailDTOItems: Array<OrderDetailDTO> = new Array<OrderDetailDTO>();

      if (Array.isArray(orderDetails))
       // orderDetails.forEach(async (orderDetailItem: any) => {
        for (const orderDetailItem of orderDetails) {
          const OrderDetailDTOItem = new OrderDetailDTO();

          OrderDetailDTOItem.ID = orderDetailItem.ID;
          OrderDetailDTOItem.Product = await this.ProductRepository.getById(orderDetailItem.ProductId);
          OrderDetailDTOItem.Count = orderDetailItem.Count;
          OrderDetailDTOItem.OrderId = orderDetailItem.OrderId;

          OrderDetailDTOItems.push(OrderDetailDTOItem);
        }
        //});

      orderAggregateResponseItem.Order = OrderDTOItem;
      orderAggregateResponseItem.OrderDetails = OrderDetailDTOItems;

      return orderAggregateResponseItem;
    } catch {
      throw new Error("Unable to get order");
    }
  };

  createOrderAggreate = async (orderAggregateRequest: orderAggregateRequest): Promise<any> => {
    try {
      const OrderAggregateItem = new OrderAggregate();
      let OrderAggregateItemID = await this.orderRepository.create(orderAggregateRequest.Order);

      if (OrderAggregateItemID > 0)
        orderAggregateRequest.OrderDetails.forEach(async (orderDetailItem: any) => {
          orderDetailItem.OrderId = OrderAggregateItemID;
          await this.OrderDetailRepository.create(orderDetailItem);
        });

      return OrderAggregateItemID;
    } catch (ex) {
      throw new Error("Unable to create order");
    }
  };



}

