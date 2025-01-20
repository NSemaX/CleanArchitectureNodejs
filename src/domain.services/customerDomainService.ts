import { inject, injectable } from "inversify";
import { Types } from "../infrastructure/utility/DiTypes";
import { ICustomerRepository } from "../domain/models/customer/ICustomerRepository";
import { CustomerInput } from "../domain/models/customer/customer";


export interface ICustomerDomainService {
  createCustomer: (Customer: CustomerInput) => Promise<any>;
}

@injectable()
export class CustomerDomainService implements ICustomerDomainService {
  @inject(Types.CUSTOMER_REPOSITORY)
  private CustomerRepository: ICustomerRepository;


  createCustomer = async (Customer: CustomerInput): Promise<any> => {
    try { //check email duplicated?
      return this.CustomerRepository.create(Customer);
    } catch (ex) {
      throw new Error("Unable to create Customer");
    }
  };


}

