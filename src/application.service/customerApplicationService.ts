import { inject, injectable } from "inversify";
import { Types } from "../infrastructure/utility/DiTypes";
import { ICustomerDomainService } from "../domain.services/customerDomainService";
import { ICustomerRepository } from "../domain/models/customer/ICustomerRepository";
import { CustomerResponse } from "../application/dtos/customer/customerResponse";
import CustomerCreateRequest from "../application/dtos/customer/customerCreateRequest";
import { CustomerUpdateRequest } from "../application/dtos/customer/customerUpdateRequest";
import { CustomerInput } from "../domain/models/customer/customer";
import { CustomerStatus } from "../domain/models/customer/customerStatus";

export interface ICustomerApplicationService {

  getCustomerById: (Id: number) => Promise<CustomerResponse>;
  getAllCustomers: () => Promise<Array<CustomerResponse>>;
  createCustomer: (Customer: CustomerCreateRequest) => Promise<any>;
  updateCustomer: (Id: number, Customer: CustomerUpdateRequest) => Promise<number>;
  deleteCustomer: (Id: number) => Promise<boolean>;
}

@injectable()
export class CustomerApplicationService implements ICustomerApplicationService {
  @inject(Types.CUSTOMER_REPOSITORY)
  private CustomerRepository: ICustomerRepository;

  @inject(Types.CUSTOMER_DOMAIN_SERVICE)
  private CustomerDomainService: ICustomerDomainService;

  getAllCustomers = async (): Promise<Array<CustomerResponse>> => {
      const customers= this.CustomerRepository.getAll();   
      return customers;
  };


  getCustomerById = async (Id: number): Promise<CustomerResponse> => {
    try {
      return this.CustomerRepository.getById(Id);
    } catch(ex) {
      /*const error = ex as APIError;
      throw new APIError("customer error","Unable to get Customer",HttpStatusCode.INTERNAL_SERVER, error.stack);*/
      throw new Error("Unable to get Customer");
    }
  };

  createCustomer = async (Customer: CustomerCreateRequest): Promise<any> => {
    try { 
       let CustomerItem:CustomerInput={Name:Customer.Name, Surname:Customer.Surname,Email:Customer.Email,Password:Customer.Password,Status:CustomerStatus.Active};
      return this.CustomerDomainService.createCustomer(CustomerItem);
    } catch (ex) {
      throw new Error("Unable to create Customer");
    }
  };

  updateCustomer = async (Id: number, Customer: CustomerUpdateRequest): Promise<number> => {
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
