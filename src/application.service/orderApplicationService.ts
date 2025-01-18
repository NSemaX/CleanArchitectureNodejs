import { inject, injectable } from "inversify";
import Order, { OrderInput, OrderOutput } from "../domain/aggregates/orderAggregate/order";
import { Types } from "../infrastructure/utility/DiTypes";
import { IOrderRepository } from "../infrastructure/repositories/orderRepository";
import orderAggregateResponse, { OrderDTO, OrderDetailDTO } from "../application/dtos/orderAggregateResponse";
import { OrderDetailOutput } from "../domain/aggregates/orderAggregate/orderDetail";
import { IOrderDetailRepository } from "../infrastructure/repositories/orderDetailRepository";
import { IProductRepository } from "../infrastructure/repositories/productRepository";
import { ICustomerRepository } from "../infrastructure/repositories/customerRepository";
import orderAggregateRequest from "../application/dtos/orderAggregateRequest";
import { IOrderDomainService } from "../domain.services/orderDomainService";
import { OrderAggregateInput } from "../domain/aggregates/orderAggregate/orderAggregate";

export interface IOrderApplicationService {
  getAllOrders: () => Promise<Array<OrderOutput>>;
  getOrderById: (Id: number) => Promise<orderAggregateResponse>;
  createOrder: (orderAggregateRequest: orderAggregateRequest) => Promise<any>;
  updateOrder: (Id: number, order: OrderInput) => Promise<number>;
  deleteOrder: (Id: number) => Promise<boolean>;
}

@injectable()
export class OrderApplicationService implements IOrderApplicationService {

  @inject(Types.ORDER_DOMAIN_SERVICE)
  private orderDomainService: IOrderDomainService;

  @inject(Types.ORDER_REPOSITORY)
  private orderRepository: IOrderRepository;

  @inject(Types.ORDER_DETAIL_REPOSITORY)
  private OrderDetailRepository: IOrderDetailRepository;

  @inject(Types.PRODUCT_REPOSITORY)
  private ProductRepository: IProductRepository;

  @inject(Types.CUSTOMER_REPOSITORY)
  private CustomerRepository: ICustomerRepository;

  getAllOrders = async (): Promise<Array<OrderOutput>> => {
    try {
      return this.orderRepository.getAll();
    } catch {
      throw new Error("Unable to get orders");
    }
  };


  getOrderById = async (Id: number): Promise<orderAggregateResponse> => {
    try {
      const orderAggregateResponseItem = new orderAggregateResponse();

      const orderAggregateOutputItem = await this.orderDomainService.getOrderById(Id);
      let orderItem = orderAggregateOutputItem.Order;
      let orderDetails: OrderDetailOutput[] = orderAggregateOutputItem.OrderDetails;
      orderAggregateResponseItem.OrderDetails = [];


      let OrderDTOItem = new OrderDTO();

      OrderDTOItem.ID = orderItem.ID;
      OrderDTOItem.Customer = await this.CustomerRepository.getById(orderItem.CustomerId);
      OrderDTOItem.TotalAmount = orderItem.TotalAmount;
      OrderDTOItem.Status = orderItem.Status
      OrderDTOItem.PurchasedDate = orderItem.PurchasedDate;

      let OrderDetailDTOItems: Array<OrderDetailDTO> = new Array<OrderDetailDTO>();

      if (Array.isArray(orderDetails))
        for (const orderDetailItem of orderDetails) {
          const OrderDetailDTOItem = new OrderDetailDTO();

          OrderDetailDTOItem.ID = orderDetailItem.ID;
          OrderDetailDTOItem.Product = await this.ProductRepository.getById(orderDetailItem.ProductId);
          OrderDetailDTOItem.Count = orderDetailItem.Count;
          OrderDetailDTOItem.OrderId = orderDetailItem.OrderId;

          OrderDetailDTOItems.push(OrderDetailDTOItem);
        }

      orderAggregateResponseItem.Order = OrderDTOItem;
      orderAggregateResponseItem.OrderDetails = OrderDetailDTOItems;

      return orderAggregateResponseItem;
    } catch {
      throw new Error("Unable to get order");
    }
  };

  createOrder = async (orderAggregateRequest: orderAggregateRequest): Promise<any> => {
    try {
      const OrderAggregateInputItem = new OrderAggregateInput();

          OrderAggregateInputItem.Order=orderAggregateRequest.Order;

          orderAggregateRequest.OrderDetails.forEach(async (orderDetailItem: any) => {
          OrderAggregateInputItem.OrderDetails.push(orderDetailItem);
        });

      let OrderAggregateItemID = await this.orderDomainService.createOrder(OrderAggregateInputItem);

      return OrderAggregateItemID;
    } catch (ex) {
      throw new Error("Unable to create order");
    }
  };

  updateOrder = async (Id: number, order: OrderInput): Promise<number> => {
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

