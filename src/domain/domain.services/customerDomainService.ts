import { inject, injectable } from "inversify";
import { CustomerInput } from "../models/customer/customer";
import { ICustomerRepository } from "../models/customer/ICustomerRepository";
import { Types } from "../../infrastructure/utility/DiTypes";


export interface ICustomerDomainService {
  createCustomer: (Customer: CustomerInput) => Promise<any>;
}

@injectable()
export class CustomerDomainService implements ICustomerDomainService {
  @inject(Types.CUSTOMER_REPOSITORY)
  private CustomerRepository: ICustomerRepository;


  createCustomer = async (Customer: CustomerInput): Promise<any> => {
    try { 
      const customer = await this.CustomerRepository.findByEmail(Customer.Email);
      if (customer!=null) {
        throw new Error("Unable to create customer, customer is already exists.");
      }
      return this.CustomerRepository.create(Customer);
    } catch (ex) {
      throw new Error("Unable to create Customer");
    }
  };


}

