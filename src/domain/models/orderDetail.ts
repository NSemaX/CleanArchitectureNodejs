import { Model, Sequelize, DataTypes, Optional } from "sequelize";

export interface IOrderDetail {
    ID: number;
    OrderId: number;
    ProductId: number;
    Count: number;
}

export interface OrderDetailRequest extends Optional<IOrderDetail, 'ID'> {}
export interface OrderDetailResponse extends Required<IOrderDetail> {}

class OrderDetail extends Model<IOrderDetail,OrderDetailRequest> implements IOrderDetail {
    public ID!: number
    public OrderId!: number
    public ProductId!: number
    public Count!: number

    static initModel(sequelize: Sequelize): void {
        OrderDetail.init(
            {
                ID: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                },
                OrderId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                ProductId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                Count: {
                    type: DataTypes.INTEGER
                }
            },
            {
                sequelize,
                timestamps: true,
                tableName: "OrderDetails"
            }
        );
    }
}

export default OrderDetail