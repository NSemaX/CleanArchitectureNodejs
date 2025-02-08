import {  ICustomer } from "./customer";

export interface ICustomerRepository {
    getAll: () => Promise<Array<ICustomer>>;
    getById: (id: number) => Promise<ICustomer>;
    findByEmail: (email: string) => Promise<ICustomer>;
    create: (Customer: ICustomer) => Promise<any>;
    update: (id: number, Customer: Partial<ICustomer>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}