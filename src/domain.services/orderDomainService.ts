import { inject, injectable } from "inversify";
import Order, { OrderInput, OrderOutput } from "../domain/aggregates/orderAggregate/order";
import OrderDetail, { OrderDetailOutput } from "../domain/aggregates/orderAggregate/orderDetail";
import { OrderAggregateInput, OrderAggregateOutput } from "../domain/aggregates/orderAggregate/orderAggregate";
import { Types } from "../infrastructure/utility/DiTypes";
import { IOrderRepository } from "../infrastructure/repositories/orderRepository";
import { IOrderDetailRepository } from "../infrastructure/repositories/orderDetailRepository";
import { IProductRepository } from "../infrastructure/repositories/productRepository";



export interface IOrderDomainService {

  getOrderById: (Id: number) => Promise<OrderAggregateOutput>;
  createOrder: (orderAggregateRequest: OrderAggregateInput) => Promise<any>;
  updateOrder: (Id: number, order: OrderInput) => Promise<number>;
  deleteOrder: (Id: number) => Promise<boolean>;
}

@injectable()
export class OrderDomainService implements IOrderDomainService {

  @inject(Types.ORDER_REPOSITORY)
  private orderRepository: IOrderRepository;

  @inject(Types.ORDER_DETAIL_REPOSITORY)
  private OrderDetailRepository: IOrderDetailRepository;

  @inject(Types.PRODUCT_REPOSITORY)
  private ProductRepository: IProductRepository;

  getOrderById = async (Id: number): Promise<OrderAggregateOutput> => {
    try {
      const orderAggregateOutputItem = new OrderAggregateOutput();
      let orderItem = await this.orderRepository.getById(Id);
      let orderDetails: OrderDetailOutput[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID);
      orderAggregateOutputItem.OrderDetails = [];

      let TotalAmount=0;

      let OrderDetailOutputItems: Array<OrderDetailOutput> = new Array<OrderDetailOutput>();

      if (Array.isArray(orderDetails))
        for (const orderDetailItem of orderDetails) {
          const OrderDetailOutputItem = new OrderDetail();

          OrderDetailOutputItem.ID = orderDetailItem.ID;
          OrderDetailOutputItem.OrderId = orderDetailItem.OrderId;
          OrderDetailOutputItem.ProductId=orderDetailItem.ProductId;

          let productItem  = await this.ProductRepository.getById(orderDetailItem.ProductId);

          TotalAmount +=productItem.Price * orderDetailItem.Count ;
          OrderDetailOutputItem.Count = orderDetailItem.Count;
          OrderDetailOutputItems.push(OrderDetailOutputItem);
        }


        orderItem.TotalAmount=TotalAmount;

        orderAggregateOutputItem.Order = orderItem;
        orderAggregateOutputItem.OrderDetails = OrderDetailOutputItems;

      return orderAggregateOutputItem;
    } catch {
      throw new Error("Unable to get order");
    }
  };

  createOrder = async (orderAggregateRequest: OrderAggregateInput): Promise<any> => {
    try {
      const OrderAggregateItem = new OrderAggregateInput();
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

