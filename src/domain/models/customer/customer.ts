import { Optional } from "sequelize";

export interface ICustomer {
    ID: number;
    Name: string;
    Surname: string;
    Email: string;
    Password: string;
    Status: number;
}

export interface CustomerInput extends Optional<ICustomer, 'ID'> {}
export interface CustomerOutput extends Required<ICustomer> {}


