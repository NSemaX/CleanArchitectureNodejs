import { inject, injectable } from "inversify";
import Customer, { CustomerRequest, CustomerResponse } from "../domain/models/customer";
import { Types } from "../infrastructure/utility/DiTypes";
import { ICustomerRepository } from "../infrastructure/repositories/customerRepository";

export interface ICustomerService {

  getCustomerById: (Id: number) => Promise<CustomerResponse>;
  getAllCustomers: () => Promise<Array<CustomerResponse>>;
  createCustomer: (Customer: CustomerRequest) => Promise<any>;
  updateCustomer: (Id: number, Customer: CustomerRequest) => Promise<number>;
  deleteCustomer: (Id: number) => Promise<boolean>;
}

@injectable()
export class CustomerService implements ICustomerService {
  @inject(Types.CUSTOMER_REPOSITORY)
  private CustomerRepository: ICustomerRepository;



  getAllCustomers = async (): Promise<Array<CustomerResponse>> => {
    try {
      return this.CustomerRepository.getAll();
    } catch {
      throw new Error("Unable to get Customers");
    }
  };

  getCustomerById = async (Id: number): Promise<CustomerResponse> => {
    try {
      return this.CustomerRepository.getById(Id);
    } catch {
      throw new Error("Unable to get Customer");
    }
  };

  createCustomer = async (Customer: CustomerRequest): Promise<any> => {
    try {
      return this.CustomerRepository.create(Customer);
    } catch (ex) {
      throw new Error("Unable to create Customer");
    }
  };

  updateCustomer = async (Id: number, Customer: CustomerRequest): Promise<number> => {
    try {
      return this.CustomerRepository.update(Id, Customer);
    } catch {
      throw new Error("Unable to updated Customer");
    }
  };

  deleteCustomer = async (Id: number,): Promise<boolean> => {
    try {
      return this.CustomerRepository.delete(Id);
    } catch {
      throw new Error("Unable to delete Customer");
    }
  };
}

