import { inject, injectable } from "inversify";
import Order, {
  OrderInput,
  OrderOutput,
} from "../domain/aggregates/orderAggregate/order";
import OrderDetail, {
  OrderDetailOutput,
} from "../domain/aggregates/orderAggregate/orderDetail";
import { Types } from "../infrastructure/utility/DiTypes";
import { IOrderRepository } from "../infrastructure/repositories/orderRepository";
import { IOrderDetailRepository } from "../infrastructure/repositories/orderDetailRepository";
import { IProductRepository } from "../infrastructure/repositories/productRepository";

export interface IOrderDomainService {
  checkOrderisReachedtheMaxProductCountInADay: (Id: number) => Promise<boolean>;
}

@injectable()
export class OrderDomainService implements IOrderDomainService {
  @inject(Types.ORDER_REPOSITORY)
  private orderRepository: IOrderRepository;

  @inject(Types.ORDER_DETAIL_REPOSITORY)
  private OrderDetailRepository: IOrderDetailRepository;

  @inject(Types.PRODUCT_REPOSITORY)
  private ProductRepository: IProductRepository;

  checkOrderisReachedtheMaxProductCountInADay = async (Id: number): Promise<boolean> => {
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
      const maxProductCount = 5;
      repeaters.forEach((num) => { if (num > maxProductCount) greater++; });
      if(greater >0)
          result=true;
      return result;
    } catch (ex) {
      throw new Error("Unable to create order");
    }
  };
}
