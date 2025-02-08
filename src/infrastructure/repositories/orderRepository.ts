import { injectable } from "inversify";
import "reflect-metadata";
import { IOrderRepository } from '../../domain/aggregates/orderAggregate/IOrderRepository';
import Order from "../db/dbModels/orderDBModel";
import { IOrder } from "../../domain/aggregates/orderAggregate/order";


@injectable()
export class OrderRepository implements IOrderRepository {

    getAll = async (): Promise<Array<IOrder>> => {
        return Order.findAll()
    }


    getById = async (id: number): Promise<IOrder> => {
        const item = await Order.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    getByCustomerId = async (customerId: number): Promise<Array<IOrder>> => {

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


    create = async (payload: IOrder): Promise<any> => {
        const item = await Order.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<IOrder>): Promise<number> => {
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

