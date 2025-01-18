import { inject, injectable } from "inversify";
import Order, { OrderInput, OrderOutput } from "../domain/aggregates/orderAggregate/order";
import { Types } from "../infrastructure/utility/DiTypes";
import { IOrderRepository } from "../infrastructure/repositories/orderRepository";
import orderAggregateResponse, { OrderDTO, OrderDetailDTO } from "../application/dtos/orderAggregateResponse";
import { OrderDetailOutput } from "../domain/aggregates/orderAggregate/orderDetail";
import { IProductRepository } from "../infrastructure/repositories/productRepository";
import { ICustomerRepository } from "../infrastructure/repositories/customerRepository";
import orderAggregateRequest from "../application/dtos/orderAggregateRequest";
import { IOrderDomainService } from "../domain.services/orderDomainService";
import { OrderAggregateInput } from "../domain/aggregates/orderAggregate/orderAggregate";
import { IOrderDetailRepository } from "../infrastructure/repositories/orderDetailRepository";

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
      let orderItem = await this.orderRepository.getById(Id);
      let orderDetails: OrderDetailOutput[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID);
      orderAggregateResponseItem.OrderDetails = [];

      let TotalAmount=0;
      let OrderDTOItem = new OrderDTO();

      OrderDTOItem.ID = orderItem.ID;
      OrderDTOItem.Customer = await this.CustomerRepository.getById(orderItem.CustomerId);

      OrderDTOItem.Status = orderItem.Status
      OrderDTOItem.PurchasedDate = orderItem.PurchasedDate;

      let OrderDetailDTOItems: Array<OrderDetailDTO> = new Array<OrderDetailDTO>();

      if (Array.isArray(orderDetails))
       // orderDetails.forEach(async (orderDetailItem: any) => {
        for (const orderDetailItem of orderDetails) {
          const OrderDetailDTOItem = new OrderDetailDTO();

          OrderDetailDTOItem.ID = orderDetailItem.ID;
          OrderDetailDTOItem.Product = await this.ProductRepository.getById(orderDetailItem.ProductId);
          TotalAmount +=OrderDetailDTOItem.Product.Price * orderDetailItem.Count ;
          OrderDetailDTOItem.Count = orderDetailItem.Count;
          OrderDetailDTOItem.OrderId = orderDetailItem.OrderId;

          OrderDetailDTOItems.push(OrderDetailDTOItem);
        }
        //});
        OrderDTOItem.TotalAmount=TotalAmount;
      orderAggregateResponseItem.Order = OrderDTOItem;
      orderAggregateResponseItem.OrderDetails = OrderDetailDTOItems;

      return orderAggregateResponseItem;
    } catch {
      throw new Error("Unable to get order");
    }
  };

  createOrder = async (orderAggregateRequest: orderAggregateRequest): Promise<any> => {
    try {
      let reachedMaxProductInADayCount = await this.orderDomainService.checkOrder(orderAggregateRequest.Order.CustomerId);
      
      if (reachedMaxProductInADayCount == false)
      {
        let OrderAggregateItemID = await this.orderRepository.create(orderAggregateRequest.Order);

        if (OrderAggregateItemID > 0)
          orderAggregateRequest.OrderDetails.forEach(async (orderDetailItem: any) => {
            orderDetailItem.OrderId = OrderAggregateItemID;
            await this.OrderDetailRepository.create(orderDetailItem);
          });
          return OrderAggregateItemID;
      }
      
      throw new Error("Unable to create order");
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

