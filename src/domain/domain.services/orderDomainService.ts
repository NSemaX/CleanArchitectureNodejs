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
  isOrderReachedtheMaxProductCountInADay: (Id: number) => Promise<boolean>;
}

@injectable()
export class OrderDomainService implements IOrderDomainService {
  @inject(Types.ORDER_REPOSITORY)
  private orderRepository: IOrderRepository;

  @inject(Types.ORDER_DETAIL_REPOSITORY)
  private OrderDetailRepository: IOrderDetailRepository;

  @inject(Types.PRODUCT_REPOSITORY)
  private ProductRepository: IProductRepository;

  isOrderReachedtheMaxProductCountInADay = async (Id: number): Promise<boolean> => {
    try {
      let result = false;
      const today = new Date();
      let orderItems: IOrder[] = await this.orderRepository.getByCustomerId(Id);
      const orderItemsFiltered = orderItems.filter(
        (item) => today.toDateString() === item.PurchasedDate.toDateString()
      );

      let customerProducts: number []=new Array<number>;
      let allOrderDetails: IOrderDetail[]=new Array<IOrderDetail>;
      for (const orderItem of orderItemsFiltered) {
        let orderDetails: IOrderDetail[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID!);
        if (Array.isArray(orderDetails))
        {
          for (const orderDetailItem of orderDetails) {
            allOrderDetails.push(orderDetailItem);
          }         
        }
      }

      var groupedOrderDetails = Helpers.groupBy(allOrderDetails,"ProductId");
      let grouppedOrderDetailItems: IOrderDetail[]=new Array<IOrderDetail>;


    for (let [key, value] of Object.entries(groupedOrderDetails)) {
      console.log(key + ": " + value); 
      grouppedOrderDetailItems =value;
      let grouppedProductCount:number=0;
      grouppedOrderDetailItems.forEach((orderDetail) => {              
        grouppedProductCount+=orderDetail.Count;             
          });
          customerProducts.push(grouppedProductCount);
      }
    
      console.log(customerProducts);

      let greater = 0;
      const maxOrderableProductCountInADay = vars.maxOrderableProductCountInADay;
      customerProducts.forEach((num: number) => { if (num > maxOrderableProductCountInADay) greater++; });
      if (greater > 0)
        result = true;
      return result;
    } catch (ex) {
      throw new Error("Unable to create order");
    }
  };

}

