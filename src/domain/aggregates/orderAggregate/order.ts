import { Model, Sequelize, DataTypes, Optional } from "sequelize";


export interface IOrder { //defines all the possible attributes of our model
    ID: number;
    CustomerId: number;
    TotalAmount: number;
    Status: number;
    PurchasedDate: Date;
}


export interface OrderInput extends Optional<IOrder, 'ID'| 'TotalAmount'> {} //defines the type of the object passed to Sequelize’s model.create
export interface OrderOutput extends Required<IOrder> {} //defines the returned object from model.create, model.update, and model.findOne

class Order extends Model<IOrder,OrderInput> implements IOrder {
    public ID!: number
    public CustomerId!: number
    public TotalAmount!: number
    public Status!: number
    public PurchasedDate!: Date;


    static initModel(sequelize: Sequelize): void {
        Order.init(
            {
                ID: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                },
                CustomerId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                TotalAmount: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                Status: {
                    type: DataTypes.INTEGER
                },
                PurchasedDate:  DataTypes.DATE
            },
            {
                sequelize,
                timestamps: true,
                tableName: "Orders"
            }
        );
    }
}

export default Order