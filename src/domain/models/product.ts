import { Model, Sequelize, DataTypes, Optional } from "sequelize";

export interface IProduct {
    ID: number;
    Name: string;
    Price: number;
}

export interface ProductInput extends Optional<IProduct, 'ID'> {}
export interface ProductOutput extends Required<IProduct> { } //CreatedAt: Date, UpdatedAt: Date

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