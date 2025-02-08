import { inject, injectable } from "inversify";
import  { OrderDetailResponseDTO, OrderItemResponse, OrderResponse, OrderResponseDTO } from "../dtos/order/orderResponse";
import OrderCreateRequest from "../dtos/order/orderCreateRequest";
import OrderUpdateRequest from "../dtos/order/orderUpdateRequest";
import { IOrderDomainService } from "../../domain/domain.services/orderDomainService";
import { IOrderRepository } from "../../domain/aggregates/orderAggregate/IOrderRepository";
import { IOrderDetailRepository } from "../../domain/aggregates/orderAggregate/IOrderDetailRepository";
import { IProductRepository } from "../../domain/models/product/IProductRepository";
import { ICustomerRepository } from "../../domain/models/customer/ICustomerRepository";
import { Types } from "../../infrastructure/utility/DiTypes";
import { IOrder } from "../../domain/aggregates/orderAggregate/order";
import { IOrderDetail } from "../../domain/aggregates/orderAggregate/orderDetail";
import { OrderStatus } from "../../domain/aggregates/orderAggregate/orderStatus";



export interface IOrderApplicationService {
  getAllOrders: () => Promise<Array<OrderItemResponse>>;
  getOrderById: (Id: number) => Promise<OrderResponse>;
  getOrdersByCustomerId: (Id: number) => Promise<Array<OrderResponse>>;
  createOrder: (orderAggregateRequest: OrderCreateRequest) => Promise<any>;
  updateOrder: (Id: number, order: OrderUpdateRequest) => Promise<number>;
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


  getAllOrders = async (): Promise<Array<OrderItemResponse>> => {
    try {
      return this.orderRepository.getAll();
    } catch {
      throw new Error("Unable to get orders");
    }
  };

  getOrderById = async (Id: number): Promise<OrderResponse> => {
    try {
      let orderItem = await this.orderRepository.getById(Id);
      let orderDetails: IOrderDetail[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID!);
      let orderAggregateResponseItem = await this.prepareOrderAggregate(orderItem, orderDetails);
      return orderAggregateResponseItem;
    } catch {
      throw new Error("Unable to get order");
    }
  };

  getOrdersByCustomerId = async (CustomerId: number): Promise<Array<OrderResponse>> => {
    try {
      let orderAggregateResponseList: OrderResponse[] = new Array<OrderResponse>();
      let orderItems: IOrder[] = await this.orderRepository.getByCustomerId(CustomerId);

      for (const orderItem of orderItems) {
        let orderDetails: IOrderDetail[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID!);
        let orderAggregateResponseItem = await this.prepareOrderAggregate(orderItem, orderDetails);
        orderAggregateResponseList.push(orderAggregateResponseItem);
      }
      return orderAggregateResponseList;
    } catch {
      throw new Error("Unable to get order");
    }
  };

  createOrder = async (orderCreateRequest: OrderCreateRequest): Promise<any> => {
    try {
      let isReachedMaxProductInADay = await this.orderDomainService.isOrderReachedtheMaxProductCountInADay(orderCreateRequest.Order.CustomerId);

      if (!isReachedMaxProductInADay) {
        let TotalAmount = 0;
        let OrderItem: IOrder = { CustomerId: orderCreateRequest.Order.CustomerId, TotalAmount:TotalAmount, Status: OrderStatus.Created, PurchasedDate: orderCreateRequest.Order.PurchasedDate };
        let OrderAggregateItemID = await this.orderRepository.create(OrderItem);
        if (OrderAggregateItemID > 0)

          for (const orderDetailItem of orderCreateRequest.OrderDetails) {
            let OrderDetailItem: IOrderDetail = { OrderId: OrderAggregateItemID, Count:orderDetailItem.Count, ProductId:orderDetailItem.ProductId };
            let productItem= await this.ProductRepository.getById(orderDetailItem.ProductId);
            if (productItem!=null) {
            TotalAmount += productItem.Price * orderDetailItem.Count;
            }
            await this.OrderDetailRepository.create(OrderDetailItem);
          }

        OrderItem.TotalAmount = TotalAmount;
        await this.orderRepository.update(OrderAggregateItemID, OrderItem);
        return OrderAggregateItemID;
      }
      throw new Error("Unable to create order, reached to max product count in a day.");
    } catch (ex) {
      throw new Error("Unable to create order");
    }
  };

  updateOrder = async (Id: number, orderUpdateRequest: OrderUpdateRequest): Promise<number> => {
    try {
      return this.orderRepository.update(Id, orderUpdateRequest);
    } catch {
      throw new Error("Unable to updated order");
    }
  };

  deleteOrder = async (Id: number,): Promise<boolean> => {
    try {
      let orderDetails: IOrderDetail[] = await this.OrderDetailRepository.getByOrderId(Id);
      for (const orderItem of orderDetails) {
        let deletedOrderDetailItemId = await this.OrderDetailRepository.delete(orderItem.ID);
      }
      let deletedOrderItemId = this.orderRepository.delete(Id);
      return deletedOrderItemId
    } catch {
      throw new Error("Unable to delete order");
    }
  };

  prepareOrderAggregate = async (order: IOrder, orderDetails: Array<IOrderDetail>): Promise<OrderResponse> => {
    const orderResponseItem = new OrderResponse();
    orderResponseItem.OrderDetails = [];

    let OrderDTOItem = new OrderResponseDTO();

    OrderDTOItem.ID = order.ID!;
    OrderDTOItem.Customer = await this.CustomerRepository.getById(order.CustomerId);
    OrderDTOItem.Status = order.Status
    OrderDTOItem.PurchasedDate = order.PurchasedDate;

    let OrderDetailDTOItems: Array<OrderDetailResponseDTO> = new Array<OrderDetailResponseDTO>();

    if (Array.isArray(orderDetails))
      for (const orderDetailItem of orderDetails) {
        const OrderDetailDTOItem = new OrderDetailResponseDTO();
        OrderDetailDTOItem.ID = orderDetailItem.ID!;
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

