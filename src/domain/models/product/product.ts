import { Optional } from "sequelize";
export interface IProduct {
    ID: number;
    Name: string;
    Price: number;
}

export interface ProductInput extends Optional<IProduct, 'ID'> {}
export interface ProductOutput extends Required<IProduct> { } //CreatedAt: Date, UpdatedAt: Date