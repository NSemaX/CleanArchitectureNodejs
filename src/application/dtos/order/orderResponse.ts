import { CustomerOutput } from "../../../domain/models/customer/customer";
import { ProductOutput } from "../../../domain/models/product/product";


export class orderResponse {
    Order: OrderResponseDTO;
    OrderDetails:Array<OrderDetailResponseDTO>;
  }

  export class OrderResponseDTO {
    ID: number;
    Customer: CustomerOutput;
    TotalAmount: number;
    Status: number;
    PurchasedDate: Date;
    CreatedDate: Date;
    UpdatedDate: Date;
  }

  export class OrderDetailResponseDTO {
    ID: number;
    OrderId: number;
    Product: ProductOutput;
    Count: number;
    CreatedDate: Date;
    UpdatedDate: Date;
  }
  export default orderResponse