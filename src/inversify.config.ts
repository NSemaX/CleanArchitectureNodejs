import { Container } from "inversify";
import { Types } from "./infrastructure/utility/DiTypes";
import { IOrderRepository,OrderRepository,} from "./infrastructure/repositories/orderRepository";
import { IOrderController,OrderController,} from "./application/controllers/orderController";

import { IProductRepository, ProductRepository } from "./infrastructure/repositories/productRepository";
import { IProductService, ProductService } from "./domain.services/productService";
import { IProductController,ProductController,} from "./application/controllers/productController";

import { IOrderDetailRepository, OrderDetailRepository } from "./infrastructure/repositories/orderDetailRepository";

import { ICustomerRepository, CustomerRepository } from "./infrastructure/repositories/customerRepository";
import { ICustomerService, CustomerService } from "./domain.services/customerService";
import { ICustomerController,CustomerController,} from "./application/controllers/customerController";
import { IOrderDomainService, OrderDomainService } from "./domain.services/orderDomainService";
import { IOrderApplicationService, OrderApplicationService } from "./application.service/orderApplicationService";

const dIContainer = new Container();

dIContainer.bind<IOrderRepository>(Types.ORDER_REPOSITORY).to(OrderRepository);
dIContainer.bind<IOrderController>(Types.ORDER_CONTROLLER).to(OrderController);

dIContainer.bind<IProductRepository>(Types.PRODUCT_REPOSITORY).to(ProductRepository);
dIContainer.bind<IProductService>(Types.PRODUCT_SERVICE).to(ProductService);
dIContainer.bind<IProductController>(Types.PRODUCT_CONTROLLER).to(ProductController);

dIContainer.bind<IOrderDetailRepository>(Types.ORDER_DETAIL_REPOSITORY).to(OrderDetailRepository);


dIContainer.bind<ICustomerRepository>(Types.CUSTOMER_REPOSITORY).to(CustomerRepository);
dIContainer.bind<ICustomerService>(Types.CUSTOMER_SERVICE).to(CustomerService);
dIContainer.bind<ICustomerController>(Types.CUSTOMER_CONTROLLER).to(CustomerController);

dIContainer.bind<IOrderDomainService>(Types.ORDER_DOMAIN_SERVICE).to(OrderDomainService);
dIContainer.bind<IOrderApplicationService>(Types.ORDER_APPLICATION_SERVICE).to(OrderApplicationService);

export { dIContainer };