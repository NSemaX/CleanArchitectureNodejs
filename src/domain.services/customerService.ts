import { inject, injectable } from "inversify";
import Customer, { CustomerInput, CustomerOutput } from "../domain/models/customer";
import { Types } from "../infrastructure/utility/DiTypes";
import { ICustomerRepository } from "../infrastructure/repositories/customerRepository";
import { APIError } from "../application/middlewares/errorHandling/BaseError";
import { HttpStatusCode } from "../application/middlewares/errorHandling/HttpStatusCodeEnums";

export interface ICustomerService {

  getCustomerById: (Id: number) => Promise<CustomerOutput>;
  getAllCustomers: () => Promise<Array<CustomerOutput>>;
  createCustomer: (Customer: CustomerInput) => Promise<any>;
  updateCustomer: (Id: number, Customer: CustomerInput) => Promise<number>;
  deleteCustomer: (Id: number) => Promise<boolean>;
}

@injectable()
export class CustomerService implements ICustomerService {
  @inject(Types.CUSTOMER_REPOSITORY)
  private CustomerRepository: ICustomerRepository;



  getAllCustomers = async (): Promise<Array<CustomerOutput>> => {
      const customers= this.CustomerRepository.getAll();   
      return customers;
  };


  getCustomerById = async (Id: number): Promise<CustomerOutput> => {
    try {
      return this.CustomerRepository.getById(Id);
    } catch(ex) {
      /*const error = ex as APIError;
      throw new APIError("customer error","Unable to get Customer",HttpStatusCode.INTERNAL_SERVER, error.stack);*/
      throw new Error("Unable to get Customer");
    }
  };

  createCustomer = async (Customer: CustomerInput): Promise<any> => {
    try {
      return this.CustomerRepository.create(Customer);
    } catch (ex) {
      throw new Error("Unable to create Customer");
    }
  };

  updateCustomer = async (Id: number, Customer: CustomerInput): Promise<number> => {
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

