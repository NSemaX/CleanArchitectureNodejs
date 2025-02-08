import { Model, Sequelize, DataTypes } from "sequelize";
import { IProduct, ProductInput } from "../../../domain/models/product/product";



class Product extends Model<IProduct,ProductInput> implements IProduct {
    public ID!: number
    public Name!: string
    public Price!: number


    static initModel(sequelize: Sequelize): void {
        Product.init(
            {
                ID: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                },
                Name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                Price: {
                    type: DataTypes.INTEGER
                }
            },
            {
                sequelize,
                timestamps: true,
                tableName: "Products"
            }
        );
    }
}

export default Product