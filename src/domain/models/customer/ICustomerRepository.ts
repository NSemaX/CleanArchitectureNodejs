import { CustomerInput, CustomerOutput } from "./customer";

export interface ICustomerRepository {
    getAll: () => Promise<Array<CustomerOutput>>;
    getById: (id: number) => Promise<CustomerOutput>;
    findByEmail: (email: string) => Promise<CustomerOutput>;
    create: (Customer: CustomerInput) => Promise<any>;
    update: (id: number, Customer: Partial<CustomerInput>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}