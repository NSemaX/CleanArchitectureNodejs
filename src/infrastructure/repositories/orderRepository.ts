import { Op } from 'sequelize'
import { inject, injectable } from "inversify";
import "reflect-metadata";
import Order, { OrderInput, OrderOutput } from '../../domain/aggregates/orderAggregate/order'
import { Customer } from '../../domain/models';

export interface IOrderRepository {
    getAll: () => Promise<Array<OrderOutput>>;
    getById: (id: number) => Promise<OrderOutput>;
    getByCustomerId: (id: number) => Promise<Array<OrderOutput>>;
    create: (order: OrderInput) => Promise<any>;
    update: (id: number, order: Partial<OrderInput>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}


@injectable()
export class OrderRepository implements IOrderRepository {

    getAll = async (): Promise<Array<OrderOutput>> => {
        return Order.findAll()
    }


    getById = async (id: number): Promise<OrderOutput> => {
        const item = await Order.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    getByCustomerId = async (id: number): Promise<Array<OrderOutput>> => {

          const customerOrders = await Order.findAll({
            where: {
              CustomerId: id,
            },
          });

        if (!customerOrders) {
            throw new Error('not found')
        }

        return customerOrders
    }


    create = async (payload: OrderInput): Promise<any> => {
        const item = await Order.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<OrderInput>): Promise<number> => {
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

