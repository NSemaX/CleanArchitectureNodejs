import { inject, injectable } from "inversify";
import { CustomerResponse } from "../dtos/customer/customerResponse";
import CustomerCreateRequest from "../dtos/customer/customerCreateRequest";
import { CustomerUpdateRequest } from "../dtos/customer/customerUpdateRequest";
import { ICustomerRepository } from "../../domain/models/customer/ICustomerRepository";
import { ICustomerDomainService } from "../../domain/domain.services/customerDomainService";
import { Types } from "../../infrastructure/utility/DiTypes";
import { CustomerStatus } from "../../domain/models/customer/customerStatus";
import { ICustomer } from "../../domain/models/customer/customer";


export interface ICustomerApplicationService {

  getAllCustomers: () => Promise<Array<CustomerResponse>>;
  getCustomerById: (Id: number) => Promise<CustomerResponse>;
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
       let CustomerItem:ICustomer={Name:Customer.Name, Surname:Customer.Surname,Email:Customer.Email,Password:Customer.Password,Status:CustomerStatus.Active};
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
