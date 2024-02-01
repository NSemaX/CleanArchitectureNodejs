import { OrderRequest, OrderResponse } from "../models/order";
import { OrderDetailRequest, OrderDetailResponse } from "../models/orderDetail";

export class OrderAggregate {
    Order: OrderRequest;
    OrderDetails:Array<OrderDetailRequest>;
  }
  export default OrderAggregate