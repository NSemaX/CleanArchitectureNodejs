import { Op } from 'sequelize'
import { inject, injectable } from "inversify";
import "reflect-metadata";
import OrderDetail, { OrderDetailInput, OrderDetailOutput } from '../../domain/aggregates/orderAggregate/orderDetail'

export interface IOrderDetailRepository {
    getAll: () => Promise<Array<OrderDetailOutput>>;
    getById: (id: number) => Promise<OrderDetailOutput>;
    getByOrderId: (id: number) => Promise<Array<OrderDetailOutput>>;
    create: (OrderDetail: OrderDetailInput) => Promise<any>;
    update: (id: number, OrderDetail: Partial<OrderDetailInput>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}


@injectable()
export class OrderDetailRepository implements IOrderDetailRepository {

    getAll = async (): Promise<Array<OrderDetailOutput>> => {
        return OrderDetail.findAll()
    }

    getById = async (id: number): Promise<OrderDetailOutput> => {
        const item = await OrderDetail.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    getByOrderId = async (key: number): Promise<Array<OrderDetailOutput>> => {
        const items = await OrderDetail.findAll({
            where: {
                OrderId: key,
            },
        })
        
        if (!items) {
            throw new Error('not found')
        }

        return items
    }

    create = async (payload: OrderDetailInput): Promise<any> => {
        const item = await OrderDetail.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<OrderDetailInput>): Promise<number> => {
        const item = await OrderDetail.findByPk(ID)

        if (!item) {
            throw new Error('not found')
        }

        const updatedItem = await OrderDetail.update(payload, {
            where: { ID },
            returning: false

        }).then(([affectedCount]) => ({ affectedCount }));

        return updatedItem.affectedCount
    }

    delete = async (ID: number): Promise<boolean> => {
        const deletedItemCount = await OrderDetail.destroy({
            where: { ID }
        })
        if (deletedItemCount==0) {
            throw new Error('not found')
        }
        return !!deletedItemCount
    }

}

