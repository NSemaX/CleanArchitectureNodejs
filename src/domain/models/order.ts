import { Model, Sequelize, DataTypes, Optional } from "sequelize";


export interface IOrder {
    ID: number;
    CustomerId: number;
    TotalAmount: number;
    Status: number;
    PurchasedDate: Date;
}


export interface OrderRequest extends Optional<IOrder, 'ID'> {}
export interface OrderResponse extends Required<IOrder> {}

class Order extends Model<IOrder,OrderRequest> implements IOrder {
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