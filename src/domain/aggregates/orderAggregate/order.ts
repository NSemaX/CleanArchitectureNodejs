import { IEntity } from "../../models/entity";

export interface IOrder extends IEntity { //defines all the possible attributes of our model
    CustomerId: number;
    TotalAmount: number;
    Status: number;
    PurchasedDate: Date;
}

