import { Optional } from "sequelize";

export interface IOrderDetail {
    ID: number;
    OrderId: number;
    ProductId: number;
    Count: number;
}

export interface OrderDetailInput extends Optional<IOrderDetail, 'ID'> {}
export interface OrderDetailOutput extends Required<IOrderDetail> {}
