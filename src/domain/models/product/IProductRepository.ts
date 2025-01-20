import { ProductInput, ProductOutput } from "./product";

export interface IProductRepository {
    getAll: () => Promise<Array<ProductOutput>>;
    getById: (id: number) => Promise<ProductOutput>;
    create: (Product: ProductInput) => Promise<any>;
    update: (id: number, Product: Partial<ProductInput>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}
