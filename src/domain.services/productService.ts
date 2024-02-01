import { inject, injectable } from "inversify";
import Product, { ProductRequest, ProductResponse } from "../domain/models/product";
import { Types } from "../infrastructure/utility/DiTypes";
import { IProductRepository } from "../infrastructure/repositories/productRepository";

export interface IProductService {

  getProductById: (Id: number) => Promise<ProductResponse>;
  getAllProducts: () => Promise<Array<ProductResponse>>;
  createProduct: (Product: ProductRequest) => Promise<any>;
  updateProduct: (Id: number, Product: ProductRequest) => Promise<number>;
  deleteProduct: (Id: number) => Promise<boolean>;
}

@injectable()
export class ProductService implements IProductService {
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

  createProduct = async (Product: ProductRequest): Promise<any> => {
    try {
      return this.ProductRepository.create(Product);
    } catch (ex) {
      throw new Error("Unable to create Product");
    }
  };

  updateProduct = async (Id: number, Product: ProductRequest): Promise<number> => {
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

