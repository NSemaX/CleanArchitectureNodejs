import { Optional } from "sequelize";
export interface IOrder { //defines all the possible attributes of our model
    ID: number;
    CustomerId: number;
    TotalAmount: number;
    Status: number;
    PurchasedDate: Date;
}

export interface OrderInput extends Optional<IOrder, 'ID'| 'TotalAmount'> {} //defines the type of the object passed to Sequelize’s model.create
export interface OrderOutput extends Required<IOrder> {} //defines the returned object from model.create, model.update, and model.findOne
