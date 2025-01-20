import { OrderDetailInput, OrderDetailOutput } from "./orderDetail";


export interface IOrderDetailRepository {
    getAll: () => Promise<Array<OrderDetailOutput>>;
    getById: (id: number) => Promise<OrderDetailOutput>;
    getByOrderId: (id: number) => Promise<Array<OrderDetailOutput>>;
    create: (OrderDetail: OrderDetailInput) => Promise<any>;
    update: (id: number, OrderDetail: Partial<OrderDetailInput>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}