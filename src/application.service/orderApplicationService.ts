import { inject, injectable } from "inversify";
import  { OrderInput, OrderOutput } from "../domain/aggregates/orderAggregate/order";
import { Types } from "../infrastructure/utility/DiTypes";
import { OrderDetailOutput } from "../domain/aggregates/orderAggregate/orderDetail";
import orderRequest from "../application/dtos/order/orderCreateRequest";
import { IOrderDomainService } from "../domain.services/orderDomainService";
import { IProductRepository } from "../domain/models/product/IProductRepository";
import { ICustomerRepository } from "../domain/models/customer/ICustomerRepository";
import { orderUpdateRequest } from "../application/dtos/order/orderUpdateRequest";
import { IOrderDetailRepository } from "../domain/aggregates/orderAggregate/IOrderDetailRepository";
import { IOrderRepository } from "../domain/aggregates/orderAggregate/IOrderRepository";
import { OrderStatus } from "../domain/aggregates/orderAggregate/OrderStatus";
import orderResponse, { OrderDetailResponseDTO, OrderResponseDTO } from "../application/dtos/order/orderResponse";

export interface IOrderApplicationService {
  getAllOrders: () => Promise<Array<OrderOutput>>;
  getOrderById: (Id: number) => Promise<orderResponse>;
  getOrderByCustomerId: (Id: number) => Promise<Array<orderResponse>>;
  createOrder: (orderAggregateRequest: orderRequest) => Promise<any>;
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

  getOrderById = async (Id: number): Promise<orderResponse> => {
    try {
      let orderItem = await this.orderRepository.getById(Id);
      let orderDetails: OrderDetailOutput[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID);
      let orderAggregateResponseItem = await this.prepareOrderAggregate(orderItem,orderDetails);
      return orderAggregateResponseItem;
    } catch {
      throw new Error("Unable to get order");
    }
  };

  getOrderByCustomerId = async (CustomerId: number): Promise<Array<orderResponse>> => {
    try {
      let orderAggregateResponseList : orderResponse[] = new Array<orderResponse>();
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

  createOrder = async (orderRequest: orderRequest): Promise<any> => {
    try {
      let isReachedMaxProductInADay = await this.orderDomainService.isOrderReachedtheMaxProductCountInADay(orderRequest.Order.CustomerId);
      
      if (!isReachedMaxProductInADay)
      {
        let TotalAmount=0;
        let OrderItem:OrderInput={CustomerId:orderRequest.Order.CustomerId,Status:OrderStatus.Created,PurchasedDate:orderRequest.Order.PurchasedDate};
        let OrderAggregateItemID = await this.orderRepository.create(OrderItem);
        if (OrderAggregateItemID > 0)
          orderRequest.OrderDetails.forEach(async (orderDetailItem: any) => {
            orderDetailItem.OrderId = OrderAggregateItemID;
            TotalAmount += orderDetailItem.Product.Price * orderDetailItem.Count ;
            await this.OrderDetailRepository.create(orderDetailItem);
          });
          OrderItem.TotalAmount=TotalAmount;
          await this.orderRepository.update(OrderAggregateItemID,OrderItem);
          return OrderAggregateItemID;
      }     
      throw new Error("Unable to create order, reached to max product count in a day.");
    } catch (ex) {
      throw new Error("Unable to create order");
    }
  };

  updateOrder = async (Id: number, order: orderUpdateRequest): Promise<number> => {
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

   prepareOrderAggregate= async (order: OrderOutput, orderDetails: Array<OrderDetailOutput>): Promise<orderResponse> => {
    const orderResponseItem = new orderResponse();
    orderResponseItem.OrderDetails = [];

    let OrderDTOItem = new OrderResponseDTO();

    OrderDTOItem.ID = order.ID;
    OrderDTOItem.Customer = await this.CustomerRepository.getById(order.CustomerId);
    OrderDTOItem.Status = order.Status
    OrderDTOItem.PurchasedDate = order.PurchasedDate;

    let OrderDetailDTOItems: Array<OrderDetailResponseDTO> = new Array<OrderDetailResponseDTO>();

    if (Array.isArray(orderDetails))
      for (const orderDetailItem of orderDetails) {
        const OrderDetailDTOItem = new OrderDetailResponseDTO();
        OrderDetailDTOItem.ID = orderDetailItem.ID;
        OrderDetailDTOItem.Product = await this.ProductRepository.getById(orderDetailItem.ProductId);
        OrderDetailDTOItem.Count = orderDetailItem.Count;
        OrderDetailDTOItem.OrderId = orderDetailItem.OrderId;
        OrderDetailDTOItems.push(OrderDetailDTOItem);
      }

    orderResponseItem.Order = OrderDTOItem;
    orderResponseItem.OrderDetails = OrderDetailDTOItems;

    return orderResponseItem;
  }

}

