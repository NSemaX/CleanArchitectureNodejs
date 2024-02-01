import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { StatusCode } from "../../infrastructure/utility/statusCodes";

import { Types } from "../../infrastructure/utility/DiTypes";
import { IOrderService } from "../../domain.services/orderService";
import { IOrderAggregateService } from "../../application.service/orderAggregateService";
import orderAggregateRequest from "../dtos/orderAggregateRequest";
import { OrderRequest } from "../../domain/models/order";



export interface IOrderController {
  getAllOrders: (req: Request, res: Response) => Promise<Response>;
  getOrderById: (req: Request, res: Response) => Promise<Response>;
  createOrder: (req: Request, res: Response) => Promise<any>;
  updateOrder: (req: Request, res: Response) => Promise<any>;
  deleteOrder: (req: Request, res: Response) => Promise<any>;
}

@injectable()

export class OrderController implements IOrderController {
  @inject(Types.ORDER_SERVICE)
  private orderService: IOrderService;

  @inject(Types.ORDER_AGGREGATE_SERVICE)
  private orderAggregateService: IOrderAggregateService;



  public getAllOrders = async (req: Request, res: Response): Promise<Response> => {
    try {
      const allOrders = await this.orderService.getAllOrders();
      return res.status(StatusCode.SUCCESS).send(allOrders);
    } catch (ex) {
      res.status(StatusCode.SERVER_ERROR).send({
        message: (ex as Error).message
      });
      throw new Error((ex as Error).message);
    }
  };

  public getOrderById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = Number(req.params.id)
      const order = await this.orderAggregateService.getOrderAggreateById(id);
      return res.status(StatusCode.SUCCESS).send(order);
    } catch (ex) {
      if((ex as Error).message=="not found")
      return res.status(StatusCode.NOT_FOUND).json({message: (ex as Error).message});
      else
      return res.status(StatusCode.SERVER_ERROR).json({message: (ex as Error).message});
    }
  };

  public createOrder = async (req: Request, res: Response) => {
    try {
      const { Order :{ CustomerId, TotalAmount, Status, PurchasedDate}, OrderDetails: [{ProductId, Count}]} = req.body;
      const orderReq: orderAggregateRequest = {Order:{ CustomerId, TotalAmount, Status, PurchasedDate},OrderDetails: [{ ProductId, Count}]}; 
      const order = await this.orderAggregateService.createOrderAggreate(orderReq);
      res.status(StatusCode.SUCCESS).send();
    } catch (ex) {
      res.status(StatusCode.SERVER_ERROR).send({
        message: (ex as Error).message
      });

    }
  };

  public updateOrder = async (req: Request, res: Response) => {
    try {
      const { ID, CustomerId, TotalAmount, Status, PurchasedDate } = req.body;
      const order: OrderRequest = {ID, CustomerId, TotalAmount, Status, PurchasedDate}; 
      const id= order.ID!;
      const updatedOrderCount = await this.orderService.updateOrder(id, order);
      res.status(StatusCode.SUCCESS).send();
    } catch (ex) {
      if((ex as Error).message=="not found")
      return res.status(StatusCode.NOT_FOUND).json({message: (ex as Error).message});
      else
      return res.status(StatusCode.SERVER_ERROR).json({message: (ex as Error).message});
    }
  };

  public deleteOrder = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      const result = await this.orderService.deleteOrder(id);
      return res.status(StatusCode.SUCCESS).send();
    } catch (ex) {
      if((ex as Error).message=="not found")
      return res.status(StatusCode.NOT_FOUND).json({message: (ex as Error).message});
      else
      return res.status(StatusCode.SERVER_ERROR).json({message: (ex as Error).message});
    }
  };

}

