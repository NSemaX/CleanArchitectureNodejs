import { Op } from 'sequelize'
import { inject, injectable } from "inversify";
import "reflect-metadata";
import Order, { OrderRequest, OrderResponse } from '../../domain/models/order'

export interface IOrderRepository {
    getAll: () => Promise<Array<OrderResponse>>;
    getById: (id: number) => Promise<OrderResponse>;
    create: (order: OrderRequest) => Promise<any>;
    update: (id: number, order: Partial<OrderRequest>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}


@injectable()
export class OrderRepository implements IOrderRepository {

    getAll = async (): Promise<Array<OrderResponse>> => {
        return Order.findAll()
    }

    getById = async (id: number): Promise<OrderResponse> => {
        const item = await Order.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    create = async (payload: OrderRequest): Promise<any> => {
        const item = await Order.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<OrderRequest>): Promise<number> => {
        const item = await Order.findByPk(ID)

        if (!item) {
            throw new Error('not found')
        }

        const updatedItem = await Order.update(payload, {
            where: { ID },
            returning: false

        }).then(([affectedCount]) => ({ affectedCount }));

        return updatedItem.affectedCount
    }

    delete = async (ID: number): Promise<boolean> => {
        const deletedItemCount = await Order.destroy({
            where: { ID }
        })
        if (deletedItemCount==0) {
            throw new Error('not found')
        }
        return !!deletedItemCount
    }

}

