import { OrderInput, OrderOutput } from "./order";
import { OrderDetailInput, OrderDetailOutput } from "./orderDetail";

export class OrderAggregateInput {
    Order: OrderInput;
    OrderDetails:Array<OrderDetailInput>;
  }

  export class OrderAggregateOutput {
    Order: OrderOutput;
    OrderDetails:Array<OrderDetailOutput>;
  }
