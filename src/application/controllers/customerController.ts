import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { StatusCode } from "../../infrastructure/utility/statusCodes";
import { Types } from "../../infrastructure/utility/DiTypes";
import { ICustomerService } from "../../domain.services/customerService";
import { CustomerRequest } from "../../domain/models/customer";



export interface ICustomerController {
  getAllCustomers: (req: Request, res: Response) => Promise<Response>;
  getCustomerById: (req: Request, res: Response) => Promise<Response>;
  createCustomer: (req: Request, res: Response) => Promise<any>;
  updateCustomer: (req: Request, res: Response) => Promise<any>;
  deleteCustomer: (req: Request, res: Response) => Promise<any>;
}

@injectable()
export class CustomerController implements ICustomerController {
  @inject(Types.CUSTOMER_SERVICE)
  private CustomerService: ICustomerService;


  public getAllCustomers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const allCustomers = await this.CustomerService.getAllCustomers();
      return res.status(StatusCode.SUCCESS).send(allCustomers);
    } catch (ex) {
      res.status(StatusCode.SERVER_ERROR).send({
        message: (ex as Error).message
      });
      throw new Error((ex as Error).message);
    }
  };

 
  public getCustomerById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = Number(req.params.id)
      const Customer = await this.CustomerService.getCustomerById(id);
      return res.status(StatusCode.SUCCESS).send(Customer);
    } catch (ex) {
      if((ex as Error).message=="not found")
      return res.status(StatusCode.NOT_FOUND).json({message: (ex as Error).message});
      else
      return res.status(StatusCode.SERVER_ERROR).json({message: (ex as Error).message});
    }
  };

  
  public createCustomer = async (req: Request, res: Response) => {
    try {
      const { Name,Surname,Email,Password,Status } = req.body;
      const customer: CustomerRequest = {Name,Surname,Email,Password,Status}; 
      const Customer = await this.CustomerService.createCustomer(customer);
      res.status(StatusCode.SUCCESS).send();
    } catch (ex) {
      res.status(StatusCode.SERVER_ERROR).send({
        message: (ex as Error).message
      });
    }
  };


  public updateCustomer = async (req: Request, res: Response) => {
    try {
      const { Name,Surname,Email,Password,Status } = req.body;
      const customer: CustomerRequest = {Name, Surname, Email, Password, Status}; 
      const id= customer.ID!;
      const updatedCustomerCount = await this.CustomerService.updateCustomer(id, customer);
      res.status(StatusCode.SUCCESS).send();
    } catch (ex) {
      if((ex as Error).message=="not found")
      return res.status(StatusCode.NOT_FOUND).json({message: (ex as Error).message});
      else
      return res.status(StatusCode.SERVER_ERROR).json({message: (ex as Error).message});
    }
  };


  public deleteCustomer = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      const result = await this.CustomerService.deleteCustomer(id);
      return res.status(StatusCode.SUCCESS).send();
    } catch (ex) {
      if((ex as Error).message=="not found")
      return res.status(StatusCode.NOT_FOUND).json({message: (ex as Error).message});
      else
      return res.status(StatusCode.SERVER_ERROR).json({message: (ex as Error).message});
    }
  };

}

