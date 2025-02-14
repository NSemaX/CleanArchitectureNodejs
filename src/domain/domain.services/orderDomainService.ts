import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/utility/DiTypes";
import { IOrderRepository } from "../aggregates/orderAggregate/IOrderRepository";
import { IOrderDetailRepository } from "../aggregates/orderAggregate/IOrderDetailRepository";
import { IProductRepository } from "../models/product/IProductRepository";
import Helpers from "../../infrastructure/utility/Helpers";
import { vars } from "../../infrastructure/config/vars";
import { IOrder } from "../aggregates/orderAggregate/order";
import { IOrderDetail } from "../aggregates/orderAggregate/orderDetail";


export interface IOrderDomainService {
  isOrderReachedtheMaxProductCountInADay: (Id: number, OrderDetails: IOrderDetail[]) => Promise<boolean>;
}

@injectable()
export class OrderDomainService implements IOrderDomainService {
  @inject(Types.ORDER_REPOSITORY)
  private orderRepository: IOrderRepository;

  @inject(Types.ORDER_DETAIL_REPOSITORY)
  private OrderDetailRepository: IOrderDetailRepository;

  isOrderReachedtheMaxProductCountInADay = async (Id: number, OrderDetails: IOrderDetail[]): Promise<boolean> => {
    try {
      let result = false;
      const today = new Date();
      let orderItems: IOrder[] = await this.orderRepository.getByCustomerId(Id);
      const orderItemsFiltered = orderItems.filter(
        (item) => today.toDateString() === item.PurchasedDate.toDateString()
      );


      let allOrderDetails: IOrderDetail[] = new Array<IOrderDetail>;
      for (const orderItem of orderItemsFiltered) {
        let orderDetails: IOrderDetail[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID!);
        if (Array.isArray(orderDetails)) {
          allOrderDetails.concat(orderDetails);
        }
      }

      var groupedOrderDetailsDictionary = Helpers.groupBy(allOrderDetails, "ProductId");
      let grouppedOrderDetailItems: IOrderDetail[] = new Array<IOrderDetail>;

      let customerProductTotalCountsinADay: number[] = new Array<number>(); //just for logging purpose

      for (const orderDetailItem of OrderDetails) {
        for (let [key, value] of Object.entries(groupedOrderDetailsDictionary)) {
          console.log(key + ": " + value);
          if (orderDetailItem.ProductId.toString() === key) {
            grouppedOrderDetailItems = value;
            let grouppedProductCount: number = 0;
            grouppedOrderDetailItems.forEach((orderDetail) => {
              grouppedProductCount += orderDetail.Count;
            });

            if (grouppedProductCount + orderDetailItem.Count > vars.maxOrderableProductCountInADay)
              result = true;
            customerProductTotalCountsinADay.push(grouppedProductCount);
          }
        }

      }
      console.log(customerProductTotalCountsinADay);
      
      return result;
    } catch (ex) {
      throw new Error("Unable to create order");
    }
  };

}

