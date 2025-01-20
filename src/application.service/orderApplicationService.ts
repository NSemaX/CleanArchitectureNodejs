import { inject, injectable } from "inversify";
import  { OrderInput, OrderOutput } from "../domain/aggregates/orderAggregate/order";
import { Types } from "../infrastructure/utility/DiTypes";
import { IOrderRepository } from "../infrastructure/repositories/orderRepository";
import orderResponse, { OrderResponseDTO, OrderDetailResponseDTO } from "../application/dtos/orderResponse";
import { OrderDetailOutput } from "../domain/aggregates/orderAggregate/orderDetail";
import { IProductRepository } from "../infrastructure/repositories/productRepository";
import { ICustomerRepository } from "../infrastructure/repositories/customerRepository";
import orderRequest from "../application/dtos/orderRequest";
import { IOrderDomainService } from "../domain.services/orderDomainService";
import { IOrderDetailRepository } from "../infrastructure/repositories/orderDetailRepository";

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
      let isReachedMaxProductInADay = await this.orderDomainService.checkOrderisReachedtheMaxProductCountInADay(orderRequest.Order.CustomerId);
      
      if (!isReachedMaxProductInADay)
      {
        let OrderAggregateItemID = await this.orderRepository.create(orderRequest.Order);

        if (OrderAggregateItemID > 0)
          orderRequest.OrderDetails.forEach(async (orderDetailItem: any) => {
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

   prepareOrderAggregate= async (order: OrderOutput, orderDetails: Array<OrderDetailOutput>): Promise<orderResponse> => {
    const orderResponseItem = new orderResponse();
    orderResponseItem.OrderDetails = [];

    let TotalAmount=0;
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
        TotalAmount += OrderDetailDTOItem.Product.Price * orderDetailItem.Count ;
        OrderDetailDTOItem.Count = orderDetailItem.Count;
        OrderDetailDTOItem.OrderId = orderDetailItem.OrderId;
        OrderDetailDTOItems.push(OrderDetailDTOItem);
      }

    OrderDTOItem.TotalAmount=TotalAmount;
    orderResponseItem.Order = OrderDTOItem;
    orderResponseItem.OrderDetails = OrderDetailDTOItems;

    return orderResponseItem;
  }

}

