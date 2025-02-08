import { injectable } from "inversify";
import "reflect-metadata";
import { IProductRepository } from '../../domain/models/product/IProductRepository';
import Product from "../db/dbModels/productDBModel";
import { IProduct } from "../../domain/models/product/product";


@injectable()
export class ProductRepository implements IProductRepository {

    getAll = async (): Promise<Array<IProduct>> => {
        return Product.findAll()
    }

    getById = async (id: number): Promise<IProduct> => {
        const item = await Product.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    create = async (payload: IProduct): Promise<any> => {
        const item = await Product.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<IProduct>): Promise<number> => {
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

