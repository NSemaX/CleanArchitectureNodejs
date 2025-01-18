import { inject, injectable } from "inversify";
import Order, {
  OrderInput,
  OrderOutput,
} from "../domain/aggregates/orderAggregate/order";
import OrderDetail, {
  OrderDetailOutput,
} from "../domain/aggregates/orderAggregate/orderDetail";
import {
  OrderAggregateInput,
  OrderAggregateOutput,
} from "../domain/aggregates/orderAggregate/orderAggregate";
import { Types } from "../infrastructure/utility/DiTypes";
import { IOrderRepository } from "../infrastructure/repositories/orderRepository";
import { IOrderDetailRepository } from "../infrastructure/repositories/orderDetailRepository";
import { IProductRepository } from "../infrastructure/repositories/productRepository";

export interface IOrderDomainService {
  checkOrder: (Id: number) => Promise<boolean>;
}

@injectable()
export class OrderDomainService implements IOrderDomainService {
  @inject(Types.ORDER_REPOSITORY)
  private orderRepository: IOrderRepository;

  @inject(Types.ORDER_DETAIL_REPOSITORY)
  private OrderDetailRepository: IOrderDetailRepository;

  @inject(Types.PRODUCT_REPOSITORY)
  private ProductRepository: IProductRepository;

  checkOrder = async (Id: number): Promise<boolean> => {
    try {
      let orderItems : OrderOutput[] = await this.orderRepository.getByCustomerId(Id);
      const today = new Date();
      const orderItemsFiltered = orderItems.filter((word) => today.toDateString() === word.PurchasedDate.toDateString());
      let sameProductCount = 0;

      for (const orderDetailItem of orderItemsFiltered) { {

        let orderDetails: OrderDetailOutput[] = await this.OrderDetailRepository.getByOrderId(orderDetailItem.ID);

        let productElements = [];
        if (Array.isArray(orderDetails))
          for (const orderDetailItem of orderDetails) {
            let product = await this.ProductRepository.getById(
              orderDetailItem.ProductId
            );
            productElements.push(product.ID);
          }
  
       
        if (Array.isArray(productElements))
          for (const num in productElements) {
            for (const num2 in productElements) {
              if (num != num2) {
                continue;
              } else {
                if (num === num2) {
                  sameProductCount++;
                }
              }
            }
          }
        
        }
    }

      let result = false;

      if (sameProductCount > 0) result = true;

      return result;
    } catch (ex) {
      throw new Error("Unable to create order");
    }
  };
}
