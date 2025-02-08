import { IOrder } from "./order";



export interface IOrderRepository {
    getAll: () => Promise<Array<IOrder>>;
    getById: (id: number) => Promise<IOrder>;
    getByCustomerId: (customerId: number) => Promise<Array<IOrder>>;
    create: (order: IOrder) => Promise<any>;
    update: (id: number, order: Partial<IOrder>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}