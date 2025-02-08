import { Model, Sequelize, DataTypes } from "sequelize";
import { CustomerInput, ICustomer } from "../../../domain/models/customer/customer";


class Customer extends Model<ICustomer,CustomerInput> implements ICustomer {
    public ID!: number
    public Name!: string
    public Surname!: string
    public Email!: string
    public Password!: string
    public Status!: number

    static initModel(sequelize: Sequelize): void {
        Customer.init(
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
                Surname: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                },
                Email: {
                    type: DataTypes.STRING
                },
                Password: {
                    type: DataTypes.STRING
                },
                Status: {
                    type: DataTypes.INTEGER
                }
            },
            {
                sequelize,
                timestamps: true,
                tableName: "Customers"
            }
        );
    }
}

export default Customer