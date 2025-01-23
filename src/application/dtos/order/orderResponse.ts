import { CustomerResponse } from "../customer/customerResponse";
import { ProductResponse } from "../product/productResponse";


export class OrderResponse {
    Order: OrderResponseDTO;
    OrderDetails:Array<OrderDetailResponseDTO>;
  }

  export class OrderResponseDTO {
    ID: number;
    Customer: CustomerResponse;
    TotalAmount: number;
    Status: number;
    PurchasedDate: Date;
    CreatedDate: Date;
    UpdatedDate: Date;
  }

  export class OrderDetailResponseDTO {
    ID: number;
    OrderId: number;
    Product: ProductResponse;
    Count: number;
    CreatedDate: Date;
    UpdatedDate: Date;
  }
  export default OrderResponse