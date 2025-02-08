import { injectable } from "inversify";
import "reflect-metadata";
import { IOrderDetailRepository } from '../../domain/aggregates/orderAggregate/IOrderDetailRepository';
import OrderDetail from "../db/dbModels/orderDetailDBModel";
import { IOrderDetail } from "../../domain/aggregates/orderAggregate/orderDetail";

@injectable()
export class OrderDetailRepository implements IOrderDetailRepository {

    getAll = async (): Promise<Array<IOrderDetail>> => {
        return OrderDetail.findAll()
    }

    getById = async (id: number): Promise<IOrderDetail> => {
        const item = await OrderDetail.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    getByOrderId = async (key: number): Promise<Array<IOrderDetail>> => {
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

    create = async (payload: IOrderDetail): Promise<any> => {
        const item = await OrderDetail.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<IOrderDetail>): Promise<number> => {
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

