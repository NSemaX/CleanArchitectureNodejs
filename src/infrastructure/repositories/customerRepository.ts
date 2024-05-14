import { Op } from 'sequelize'
import { inject, injectable } from "inversify";
import "reflect-metadata";
import Customer, { CustomerRequest, CustomerResponse } from '../../domain/models/customer'
import { HttpStatusCode } from '../../application/middlewares/errorHandling/HttpStatusCodeEnums';
import { APIError } from '../../application/middlewares/errorHandling/BaseError';
import { NotFoundException } from '../../application/middlewares/errorHandling/APIExceptions';
import { errorMessages } from '../../application/middlewares/errorHandling/errorMessages';

export interface ICustomerRepository {
    getAll: () => Promise<Array<CustomerResponse>>;
    getById: (id: number) => Promise<CustomerResponse>;
    create: (Customer: CustomerRequest) => Promise<any>;
    update: (id: number, Customer: Partial<CustomerRequest>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}


@injectable()
export class CustomerRepository implements ICustomerRepository {

    getAll = async (): Promise<Array<CustomerResponse>> => {
        const items = Customer.findAll()
        if (!items || (await items).length==0) {
            //throw new APIError("customer error","empty customers",HttpStatusCode.NOT_FOUND);
            throw new NotFoundException(errorMessages.NotFound);
        }
        return items
    }

    getById = async (id: number): Promise<CustomerResponse> => {
        const item = await Customer.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    create = async (payload: CustomerRequest): Promise<any> => {
        const item = await Customer.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<CustomerRequest>): Promise<number> => {
        const item = await Customer.findByPk(ID)

        if (!item) {
            throw new Error('not found')
        }

        const updatedItem = await Customer.update(payload, {
            where: { ID },
            returning: false

        }).then(([affectedCount]) => ({ affectedCount }));

        return updatedItem.affectedCount
    }

    delete = async (ID: number): Promise<boolean> => {
        const deletedItemCount = await Customer.destroy({
            where: { ID }
        })
        if (deletedItemCount==0) {
            throw new Error('not found')
        }
        return !!deletedItemCount
    }

}

