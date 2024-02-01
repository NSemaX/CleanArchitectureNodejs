import { CustomerResponse } from "../../domain/models/customer";
import  { ProductResponse } from "../../domain/models/product";

export class orderAggregateResponse {
    Order: OrderDTO;
    OrderDetails:Array<OrderDetailDTO>;
  }

  export class OrderDTO {
    ID: number;
    Customer: CustomerResponse;
    TotalAmount: number;
    Status: number;
    PurchasedDate: Date;
    CreatedDate: Date;
    UpdatedDate: Date;
  }

  export class OrderDetailDTO {
    ID: number;
    OrderId: number;
    Product: ProductResponse;
    Count: number;
    CreatedDate: Date;
    UpdatedDate: Date;
  }
  export default orderAggregateResponse