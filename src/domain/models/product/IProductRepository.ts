import { IProduct } from "./product";


export interface IProductRepository {
    getAll: () => Promise<Array<IProduct>>;
    getById: (id: number) => Promise<IProduct>;
    create: (Product: IProduct) => Promise<any>;
    update: (id: number, Product: Partial<IProduct>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}
