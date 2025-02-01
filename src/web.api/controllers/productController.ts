import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { StatusCode } from "../../infrastructure/utility/statusCodes";
import { Types } from "../../infrastructure/utility/DiTypes";
import { ProductRequest } from "../../application/dtos/product/productRequest";
import { IProductApplicationService } from "../../application/application.services/productApplicationService";


export interface IProductController {
  getAllProducts: (req: Request, res: Response) => Promise<Response>;
  getProductById: (req: Request, res: Response) => Promise<Response>;
  createProduct: (req: Request, res: Response) => Promise<any>;
  updateProduct: (req: Request, res: Response) => Promise<any>;
  deleteProduct: (req: Request, res: Response) => Promise<any>;
}

@injectable()
export class ProductController implements IProductController {
  @inject(Types.PRODUCT_APPLICATION_SERVICE)
  private ProductApplicationService: IProductApplicationService;



  public getAllProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
      const allProducts = await this.ProductApplicationService.getAllProducts();
      return res.status(StatusCode.SUCCESS).send(allProducts);
    } catch (ex) {
      res.status(StatusCode.SERVER_ERROR).send({
        message: (ex as Error).message
      });
      throw new Error((ex as Error).message);
    }
  };

  public getProductById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = Number(req.params.id)
      const Product = await this.ProductApplicationService.getProductById(id);
      return res.status(StatusCode.SUCCESS).send(Product);
    } catch (ex) {
      if((ex as Error).message=="not found")
      return res.status(StatusCode.NOT_FOUND).json({message: (ex as Error).message});
      else
      return res.status(StatusCode.SERVER_ERROR).json({message: (ex as Error).message});
    }
  };

  public createProduct = async (req: Request, res: Response) => {
    try {
      const { Name, Price } = req.body;
      const productRequest: ProductRequest = {Name,Price}; 
      const product = await this.ProductApplicationService.createProduct(productRequest);
      res.status(StatusCode.SUCCESS).send();
    } catch (ex) {
      res.status(StatusCode.SERVER_ERROR).send({
        message: (ex as Error).message
      });
    }
  };

  public updateProduct = async (req: Request, res: Response) => {
    try {
      const { ID, Name, Price } = req.body;
      const productRequest: ProductRequest = {ID, Name,Price}; 
      const id=productRequest.ID!;
      const updatedProductCount = await this.ProductApplicationService.updateProduct(id, productRequest);
      res.status(StatusCode.SUCCESS).send();
    } catch (ex) {
      if((ex as Error).message=="not found")
      return res.status(StatusCode.NOT_FOUND).json({message: (ex as Error).message});
      else
      return res.status(StatusCode.SERVER_ERROR).json({message: (ex as Error).message});
    }
  };

  public deleteProduct = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      const result = await this.ProductApplicationService.deleteProduct(id);
      return res.status(StatusCode.SUCCESS).send();
    } catch (ex) {
      if((ex as Error).message=="not found")
      return res.status(StatusCode.NOT_FOUND).json({message: (ex as Error).message});
      else
      return res.status(StatusCode.SERVER_ERROR).json({message: (ex as Error).message});
    }
  };

}

