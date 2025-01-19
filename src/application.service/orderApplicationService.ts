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
import { IOrderDetailRepository } from "../infrastructure/repositories/orderDetailRepository";

export interface IOrderApplicationService {
  getAllOrders: () => Promise<Array<OrderOutput>>;
  getOrderById: (Id: number) => Promise<orderAggregateResponse>;
  getOrderByCustomerId: (Id: number) => Promise<Array<orderAggregateResponse>>;
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
      let orderItem = await this.orderRepository.getById(Id);
      let orderDetails: OrderDetailOutput[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID);
      let orderAggregateResponseItem = await this.prepareOrderAggregate(orderItem,orderDetails);
      return orderAggregateResponseItem;
    } catch {
      throw new Error("Unable to get order");
    }
  };

  getOrderByCustomerId = async (CustomerId: number): Promise<Array<orderAggregateResponse>> => {
    try {
      let orderAggregateResponseList : orderAggregateResponse[] = new Array<orderAggregateResponse>();
      let orderItems : OrderOutput[] = await this.orderRepository.getByCustomerId(CustomerId);

      for (const orderItem of orderItems) {
        let orderDetails: OrderDetailOutput[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID);
        let orderAggregateResponseItem = await this.prepareOrderAggregate(orderItem,orderDetails);
        orderAggregateResponseList.push(orderAggregateResponseItem);
      }
      return orderAggregateResponseList;
    } catch {
      throw new Error("Unable to get order");
    }
  };

  createOrder = async (orderAggregateRequest: orderAggregateRequest): Promise<any> => {
    try {
      let isReachedMaxProductInADay = await this.orderDomainService.checkOrder(orderAggregateRequest.Order.CustomerId);
      
      if (!isReachedMaxProductInADay)
      {
        let OrderAggregateItemID = await this.orderRepository.create(orderAggregateRequest.Order);

        if (OrderAggregateItemID > 0)
          orderAggregateRequest.OrderDetails.forEach(async (orderDetailItem: any) => {
            orderDetailItem.OrderId = OrderAggregateItemID;
            await this.OrderDetailRepository.create(orderDetailItem);
          });
          return OrderAggregateItemID;
      }
      
      throw new Error("Unable to create order, reached to max product count in a day.");
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

   prepareOrderAggregate= async (order: OrderOutput, orderDetails: Array<OrderDetailOutput>): Promise<orderAggregateResponse> => {
    const orderAggregateResponseItem = new orderAggregateResponse();
    orderAggregateResponseItem.OrderDetails = [];

    let TotalAmount=0;
    let OrderDTOItem = new OrderDTO();

    OrderDTOItem.ID = order.ID;
    OrderDTOItem.Customer = await this.CustomerRepository.getById(order.CustomerId);
    OrderDTOItem.Status = order.Status
    OrderDTOItem.PurchasedDate = order.PurchasedDate;

    let OrderDetailDTOItems: Array<OrderDetailDTO> = new Array<OrderDetailDTO>();

    if (Array.isArray(orderDetails))
      for (const orderDetailItem of orderDetails) {
        const OrderDetailDTOItem = new OrderDetailDTO();
        OrderDetailDTOItem.ID = orderDetailItem.ID;
        OrderDetailDTOItem.Product = await this.ProductRepository.getById(orderDetailItem.ProductId);
        TotalAmount += OrderDetailDTOItem.Product.Price * orderDetailItem.Count ;
        OrderDetailDTOItem.Count = orderDetailItem.Count;
        OrderDetailDTOItem.OrderId = orderDetailItem.OrderId;
        OrderDetailDTOItems.push(OrderDetailDTOItem);
      }

    OrderDTOItem.TotalAmount=TotalAmount;
    orderAggregateResponseItem.Order = OrderDTOItem;
    orderAggregateResponseItem.OrderDetails = OrderDetailDTOItems;

    return orderAggregateResponseItem;
  }

}

