
export class orderRequest  {
  Order: OrderRequestDTO;
  OrderDetails:Array<OrderRequestDetailDTO>;
  }
  export class OrderRequestDTO {
    CustomerId: number;
    Status: number;
    PurchasedDate: Date;
  }

  export class OrderRequestDetailDTO {
    ProductId: number;
    Count: number;
  }
  export default orderRequest