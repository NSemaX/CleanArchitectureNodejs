import { inject, injectable } from "inversify";
import {OrderOutput} from "../domain/aggregates/orderAggregate/order";
import {OrderDetailOutput} from "../domain/aggregates/orderAggregate/orderDetail";
import { Types } from "../infrastructure/utility/DiTypes";
import { IProductRepository } from "../domain/models/product/IProductRepository";
import { IOrderRepository } from "../domain/aggregates/orderAggregate/IOrderRepository";
import { IOrderDetailRepository } from "../domain/aggregates/orderAggregate/IOrderDetailRepository";

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
      let orderItems: OrderOutput[] = await this.orderRepository.getByCustomerId(Id);
      const orderItemsFiltered = orderItems.filter(
        (item) => today.toDateString() === item.PurchasedDate.toDateString()
      );

      let customerProducts = [];
      for (const orderItem of orderItemsFiltered) {
        let orderDetails: OrderDetailOutput[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID);
        if (Array.isArray(orderDetails))
          for (const orderDetailItem of orderDetails) {
            let product = await this.ProductRepository.getById(
              orderDetailItem.ProductId
            );
            customerProducts.push(product.ID);
          }        
      }

      let repeaters = Helpers.findRepeaterCountInArray(customerProducts);
      let greater = 0;
      const maxOrderableProductCountInADay = 5;
      repeaters.forEach((num) => { if (num > maxOrderableProductCountInADay) greater++; });
      if(greater > 0)
          result=true;
      return result;
    } catch (ex) {
      throw new Error("Unable to create order");
    }
  };
}
