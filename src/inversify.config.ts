import { Container } from "inversify";
import { Types } from "./infrastructure/utility/DiTypes";
import { IOrderRepository,OrderRepository,} from "./infrastructure/repositories/orderRepository";
import { IOrderController,OrderController,} from "./application/controllers/orderController";
import { IOrderDomainService, OrderDomainService } from "./domain.services/orderDomainService";
import { IOrderApplicationService, OrderApplicationService } from "./application.service/orderApplicationService";

import { IProductRepository, ProductRepository } from "./infrastructure/repositories/productRepository";
import { IProductController,ProductController,} from "./application/controllers/productController";
import { IProductApplicationService, ProductApplicationService } from "./application.service/productApplicationService";

import { IOrderDetailRepository, OrderDetailRepository } from "./infrastructure/repositories/orderDetailRepository";

import { ICustomerRepository, CustomerRepository } from "./infrastructure/repositories/customerRepository";
import { ICustomerController,CustomerController,} from "./application/controllers/customerController";
import { ICustomerDomainService, CustomerDomainService } from "./domain.services/customerDomainService";
import { ICustomerApplicationService, CustomerApplicationService } from "./application.service/customerApplicationService";


const dIContainer = new Container();

dIContainer.bind<IOrderRepository>(Types.ORDER_REPOSITORY).to(OrderRepository);
dIContainer.bind<IOrderController>(Types.ORDER_CONTROLLER).to(OrderController);
dIContainer.bind<IOrderDomainService>(Types.ORDER_DOMAIN_SERVICE).to(OrderDomainService);
dIContainer.bind<IOrderApplicationService>(Types.ORDER_APPLICATION_SERVICE).to(OrderApplicationService);

dIContainer.bind<IProductRepository>(Types.PRODUCT_REPOSITORY).to(ProductRepository);
dIContainer.bind<IProductApplicationService>(Types.PRODUCT_APPLICATION_SERVICE).to(ProductApplicationService);
dIContainer.bind<IProductController>(Types.PRODUCT_CONTROLLER).to(ProductController);

dIContainer.bind<IOrderDetailRepository>(Types.ORDER_DETAIL_REPOSITORY).to(OrderDetailRepository);


dIContainer.bind<ICustomerRepository>(Types.CUSTOMER_REPOSITORY).to(CustomerRepository);
dIContainer.bind<ICustomerDomainService>(Types.CUSTOMER_DOMAIN_SERVICE).to(CustomerDomainService);
dIContainer.bind<ICustomerApplicationService>(Types.CUSTOMER_APPLICATION_SERVICE).to(CustomerApplicationService);
dIContainer.bind<ICustomerController>(Types.CUSTOMER_CONTROLLER).to(CustomerController);



export { dIContainer };