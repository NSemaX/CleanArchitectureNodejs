import { CustomerOutput } from "../../domain/models/customer";
import  { ProductOutput } from "../../domain/models/product";

export class orderAggregateResponse {
    Order: OrderDTO;
    OrderDetails:Array<OrderDetailDTO>;
  }

  export class OrderDTO {
    ID: number;
    Customer: CustomerOutput;
    TotalAmount: number;
    Status: number;
    PurchasedDate: Date;
    CreatedDate: Date;
    UpdatedDate: Date;
  }

  export class OrderDetailDTO {
    ID: number;
    OrderId: number;
    Product: ProductOutput;
    Count: number;
    CreatedDate: Date;
    UpdatedDate: Date;
  }
  export default orderAggregateResponse