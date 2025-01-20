import { OrderInput, OrderOutput } from "./order";


export interface IOrderRepository {
    getAll: () => Promise<Array<OrderOutput>>;
    getById: (id: number) => Promise<OrderOutput>;
    getByCustomerId: (customerId: number) => Promise<Array<OrderOutput>>;
    create: (order: OrderInput) => Promise<any>;
    update: (id: number, order: Partial<OrderInput>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}