import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { StatusCode } from "../../infrastructure/utility/statusCodes";

import { Types } from "../../infrastructure/utility/DiTypes";
import { IOrderDetailService } from "../../domain.services/orderDetailService";
import { OrderDetailRequest } from "../../domain/models/orderDetail";


export interface IOrderDetailController {
  getAllOrderDetails: (req: Request, res: Response) => Promise<Response>;
  getOrderDetailById: (req: Request, res: Response) => Promise<Response>;
  createOrderDetail: (req: Request, res: Response) => Promise<any>;
  updateOrderDetail: (req: Request, res: Response) => Promise<any>;
  deleteOrderDetail: (req: Request, res: Response) => Promise<any>;
}

@injectable()
export class OrderDetailController implements IOrderDetailController {
  @inject(Types.ORDER_DETAIL_SERVICE)
  private OrderDetailService: IOrderDetailService;



  public getAllOrderDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
      const allOrderDetails = await this.OrderDetailService.getAllOrderDetails();
      return res.status(StatusCode.SUCCESS).send(allOrderDetails);
    } catch (ex) {
      res.status(StatusCode.SERVER_ERROR).send({
        message: (ex as Error).message
      });
      throw new Error((ex as Error).message);
    }
  };

  public getOrderDetailById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = Number(req.params.id)
      const OrderDetail = await this.OrderDetailService.getOrderDetailById(id);
      return res.status(StatusCode.SUCCESS).send(OrderDetail);
    } catch (ex) {
      if((ex as Error).message=="not found")
      return res.status(StatusCode.NOT_FOUND).json({message: (ex as Error).message});
      else
      return res.status(StatusCode.SERVER_ERROR).json({message: (ex as Error).message});
    }
  };

  public createOrderDetail = async (req: Request, res: Response) => {
    try {
      const { OrderId,ProductId,Count } = req.body;
      const orderDetail: OrderDetailRequest = {OrderId,ProductId,Count}; 
      const OrderDetail = await this.OrderDetailService.createOrderDetail(orderDetail);
      res.status(StatusCode.SUCCESS).send();
    } catch (ex) {
      res.status(StatusCode.SERVER_ERROR).send({
        message: (ex as Error).message
      });
    }
  };

  public updateOrderDetail = async (req: Request, res: Response) => {
    try {
      const {ID, OrderId,ProductId,Count } = req.body;
      const orderDetail: OrderDetailRequest = {ID, OrderId,ProductId,Count}; 
      const id=orderDetail.ID!;
      const updatedOrderDetailCount = await this.OrderDetailService.updateOrderDetail(id, orderDetail);
      res.status(StatusCode.SUCCESS).send();
    } catch (ex) {
      if((ex as Error).message=="not found")
      return res.status(StatusCode.NOT_FOUND).json({message: (ex as Error).message});
      else
      return res.status(StatusCode.SERVER_ERROR).json({message: (ex as Error).message});
    }
  };

  public deleteOrderDetail = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      const result = await this.OrderDetailService.deleteOrderDetail(id);
      return res.status(StatusCode.SUCCESS).send();
    } catch (ex) {
      if((ex as Error).message=="not found")
      return res.status(StatusCode.NOT_FOUND).json({message: (ex as Error).message});
      else
      return res.status(StatusCode.SERVER_ERROR).json({message: (ex as Error).message});
    }
  };

}

