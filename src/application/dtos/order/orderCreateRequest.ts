
export class orderCreateRequest  {
  Order: OrderCreateRequestDTO;
  OrderDetails:Array<OrderCreateRequestDetailDTO>;
  }
  export class OrderCreateRequestDTO {
    CustomerId: number;
    PurchasedDate: Date;
  }

  export class OrderCreateRequestDetailDTO {
    ProductId: number;
    Count: number;
  }
  export default orderCreateRequest