import { injectable } from "inversify";
import "reflect-metadata";
import  { OrderInput, OrderOutput } from '../../domain/aggregates/orderAggregate/order'
import { IOrderRepository } from '../../domain/aggregates/orderAggregate/IOrderRepository';
import Order from "../db/dbModels/orderDBModel";


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

    getByCustomerId = async (customerId: number): Promise<Array<OrderOutput>> => {

          const customerOrders = await Order.findAll({
            where: {
              CustomerId: customerId,
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

