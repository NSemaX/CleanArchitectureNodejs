import { injectable } from "inversify";
import "reflect-metadata";
import  { ProductInput, ProductOutput } from '../../domain/models/product/product'
import { IProductRepository } from '../../domain/models/product/IProductRepository';
import Product from "../db/dbModels/productDBModel";


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

