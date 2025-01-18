import { inject, injectable } from "inversify";
import Product, { ProductInput, ProductOutput } from "../domain/models/product";
import { Types } from "../infrastructure/utility/DiTypes";
import { IProductRepository } from "../infrastructure/repositories/productRepository";

export interface IProductService {

  getProductById: (Id: number) => Promise<ProductOutput>;
  getAllProducts: () => Promise<Array<ProductOutput>>;
  createProduct: (Product: ProductInput) => Promise<any>;
  updateProduct: (Id: number, Product: ProductInput) => Promise<number>;
  deleteProduct: (Id: number) => Promise<boolean>;
}

@injectable()
export class ProductService implements IProductService {
  @inject(Types.PRODUCT_REPOSITORY)
  private ProductRepository: IProductRepository;



  getAllProducts = async (): Promise<Array<ProductOutput>> => {
    try {
      return this.ProductRepository.getAll();
    } catch {
      throw new Error("Unable to get Products");
    }
  };

  getProductById = async (Id: number): Promise<ProductOutput> => {
    try {
      return this.ProductRepository.getById(Id);
    } catch {
      throw new Error("Unable to get Product");
    }
  };

  createProduct = async (Product: ProductInput): Promise<any> => {
    try {
      return this.ProductRepository.create(Product);
    } catch (ex) {
      throw new Error("Unable to create Product");
    }
  };

  updateProduct = async (Id: number, Product: ProductInput): Promise<number> => {
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

