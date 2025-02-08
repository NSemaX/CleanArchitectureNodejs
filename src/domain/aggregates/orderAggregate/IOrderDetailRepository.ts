import { IOrderDetail } from "./orderDetail";



export interface IOrderDetailRepository {
    getAll: () => Promise<Array<IOrderDetail>>;
    getById: (id: number) => Promise<IOrderDetail>;
    getByOrderId: (id: number) => Promise<Array<IOrderDetail>>;
    create: (OrderDetail: IOrderDetail) => Promise<any>;
    update: (id: number, OrderDetail: Partial<IOrderDetail>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}