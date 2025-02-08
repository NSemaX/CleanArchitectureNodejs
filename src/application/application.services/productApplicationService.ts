import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/utility/DiTypes";
import { ProductResponse } from "../dtos/product/productResponse";
import { IProductRepository } from "../../domain/models/product/IProductRepository";
import ProductCreateRequest from "../dtos/product/productCreateRequest";
import { ProductUpdateRequest } from "../dtos/product/productUpdateRequest";

export interface IProductApplicationService {

  getProductById: (Id: number) => Promise<ProductResponse>;
  getAllProducts: () => Promise<Array<ProductResponse>>;
  createProduct: (Product: ProductCreateRequest) => Promise<any>;
  updateProduct: (Id: number, Product: ProductUpdateRequest) => Promise<number>;
  deleteProduct: (Id: number) => Promise<boolean>;
}

@injectable()
export class ProductApplicationService implements IProductApplicationService {
  @inject(Types.PRODUCT_REPOSITORY)
  private ProductRepository: IProductRepository;



  getAllProducts = async (): Promise<Array<ProductResponse>> => {
    try {
      return this.ProductRepository.getAll();
    } catch {
      throw new Error("Unable to get Products");
    }
  };

  getProductById = async (Id: number): Promise<ProductResponse> => {
    try {
      return this.ProductRepository.getById(Id);
    } catch {
      throw new Error("Unable to get Product");
    }
  };

  createProduct = async (Product: ProductCreateRequest): Promise<any> => {
    try {
      return this.ProductRepository.create(Product);
    } catch (ex) {
      throw new Error("Unable to create Product");
    }
  };

  updateProduct = async (Id: number, Product: ProductUpdateRequest): Promise<number> => {
    try {
      return this.ProductRepository.update(Id, Product);
    } catch {
      throw new Error("Unable to updated Product");
    }
  };

  deleteProduct = async (Id: number,): Promise<boolean> => {
    try {
      return this.ProductRepository.delete(Id);
    } catch {
      throw new Error("Unable to delete Product");
    }
  };
}

