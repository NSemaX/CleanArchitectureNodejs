import { IEntity } from "../../models/entity";

export interface IOrderDetail extends IEntity {
    OrderId: number;
    ProductId: number;
    Count: number;
}

