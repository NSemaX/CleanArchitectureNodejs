import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { StatusCode } from "../../infrastructure/utility/statusCodes";
import { Types } from "../../infrastructure/utility/DiTypes";
import { IProductApplicationService } from "../../application.service/productApplicationService";
import { ProductInput } from "../../domain/models/product/product";


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
      const product: ProductInput = {Name,Price}; 
      const Product = await this.ProductApplicationService.createProduct(product);
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
      const product: ProductInput = {ID, Name,Price}; 
      const id=product.ID!;
      const updatedProductCount = await this.ProductApplicationService.updateProduct(id, product);
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

