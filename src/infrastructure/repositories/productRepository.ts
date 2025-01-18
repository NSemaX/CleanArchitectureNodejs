import { Op } from 'sequelize'
import { inject, injectable } from "inversify";
import "reflect-metadata";
import Product, { ProductInput, ProductOutput } from '../../domain/models/product'

export interface IProductRepository {
    getAll: () => Promise<Array<ProductOutput>>;
    getById: (id: number) => Promise<ProductOutput>;
    create: (Product: ProductInput) => Promise<any>;
    update: (id: number, Product: Partial<ProductInput>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}


@injectable()
export class ProductRepository implements IProductRepository {

    getAll = async (): Promise<Array<ProductOutput>> => {
        return Product.findAll()
    }

    getById = async (id: number): Promise<ProductOutput> => {
        const item = await Product.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    create = async (payload: ProductInput): Promise<any> => {
        const item = await Product.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<ProductInput>): Promise<number> => {
        const item = await Product.findByPk(ID)

        if (!item) {
            throw new Error('not found')
        }

        const updatedItem = await Product.update(payload, {
            where: { ID },
            returning: false

        }).then(([affectedCount]) => ({ affectedCount }));

        return updatedItem.affectedCount
    }

    delete = async (ID: number): Promise<boolean> => {
        const deletedItemCount = await Product.destroy({
            where: { ID }
        })
        if (deletedItemCount==0) {
            throw new Error('not found')
        }
        return !!deletedItemCount
    }

}

