import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { StatusCode } from "../../infrastructure/utility/statusCodes";
import { Types } from "../../infrastructure/utility/DiTypes";
import CustomerCreateRequest from "../../application/dtos/customer/customerCreateRequest";
import { CustomerUpdateRequest } from "../../application/dtos/customer/customerUpdateRequest";
import { ICustomerApplicationService } from "../../application/application.services/customerApplicationService";



export interface ICustomerController {
  getAllCustomers: (req: Request, res: Response, next:any) => {};
  getCustomerById: (req: Request, res: Response) => Promise<Response>;
  createCustomer: (req: Request, res: Response) => Promise<any>;
  updateCustomer: (req: Request, res: Response) => Promise<any>;
  deleteCustomer: (req: Request, res: Response) => Promise<any>;
}

@injectable()
export class CustomerController implements ICustomerController {
  @inject(Types.CUSTOMER_APPLICATION_SERVICE)
  private CustomerApplicationService: ICustomerApplicationService;


  public getAllCustomers = async (req: Request, res: Response, next:any) => {
    try {
      const allCustomers = await this.CustomerApplicationService.getAllCustomers();
      return res.status(StatusCode.SUCCESS).send(allCustomers);
    } catch (ex) {
      next(ex); // <---- propagate error to the middleware
    }
  };

 
  public getCustomerById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = Number(req.params.id)
      const Customer = await this.CustomerApplicationService.getCustomerById(id);
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
      const { Name,Surname,Email,Password } = req.body;
      const customerCreateRequest: CustomerCreateRequest = {Name,Surname,Email,Password}; 
      const customer = await this.CustomerApplicationService.createCustomer(customerCreateRequest);
      res.status(StatusCode.SUCCESS).send();
    } catch (ex) {
      res.status(StatusCode.SERVER_ERROR).send({
        message: (ex as Error).message
      });
    }
  };


  public updateCustomer = async (req: Request, res: Response) => {
    try {
      const { ID,Name,Surname,Email,Password,Status } = req.body;
      const customerUpdateRequest: CustomerUpdateRequest = {ID,Name, Surname, Email, Password, Status}; 
      const id= customerUpdateRequest.ID!;
      const updatedCustomerCount = await this.CustomerApplicationService.updateCustomer(id, customerUpdateRequest);
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
      const result = await this.CustomerApplicationService.deleteCustomer(id);
      return res.status(StatusCode.SUCCESS).send();
    } catch (ex) {
      if((ex as Error).message=="not found")
      return res.status(StatusCode.NOT_FOUND).json({message: (ex as Error).message});
      else
      return res.status(StatusCode.SERVER_ERROR).json({message: (ex as Error).message});
    }
  };

}

