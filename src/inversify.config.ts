import { Container } from "inversify";
import { Types } from "./infrastructure/utility/DiTypes";
import { IOrderRepository,OrderRepository,} from "./infrastructure/repositories/orderRepository";
import { IOrderService, OrderService } from "./domain.services/orderService";
import { IOrderController,OrderController,} from "./application/controllers/orderController";

import { IProductRepository, ProductRepository } from "./infrastructure/repositories/productRepository";
import { IProductService, ProductService } from "./domain.services/productService";
import { IProductController,ProductController,} from "./application/controllers/productController";

import { IOrderDetailRepository, OrderDetailRepository } from "./infrastructure/repositories/orderDetailRepository";
import { IOrderDetailService, OrderDetailService } from "./domain.services/orderDetailService";
import { IOrderDetailController,OrderDetailController,} from "./application/controllers/orderDetailController";

import { ICustomerRepository, CustomerRepository } from "./infrastructure/repositories/customerRepository";
import { ICustomerService, CustomerService } from "./domain.services/customerService";
import { ICustomerController,CustomerController,} from "./application/controllers/customerController";
import { IOrderAggregateService, OrderAggregateService } from "./application.service/orderAggregateService";

const dIContainer = new Container();

dIContainer.bind<IOrderRepository>(Types.ORDER_REPOSITORY).to(OrderRepository);
dIContainer.bind<IOrderService>(Types.ORDER_SERVICE).to(OrderService);
dIContainer.bind<IOrderController>(Types.ORDER_CONTROLLER).to(OrderController);

dIContainer.bind<IProductRepository>(Types.PRODUCT_REPOSITORY).to(ProductRepository);
dIContainer.bind<IProductService>(Types.PRODUCT_SERVICE).to(ProductService);
dIContainer.bind<IProductController>(Types.PRODUCT_CONTROLLER).to(ProductController);

dIContainer.bind<IOrderDetailRepository>(Types.ORDER_DETAIL_REPOSITORY).to(OrderDetailRepository);
dIContainer.bind<IOrderDetailService>(Types.ORDER_DETAIL_SERVICE).to(OrderDetailService);
dIContainer.bind<IOrderDetailController>(Types.ORDER_DETAIL_CONTROLLER).to(OrderDetailController);


dIContainer.bind<ICustomerRepository>(Types.CUSTOMER_REPOSITORY).to(CustomerRepository);
dIContainer.bind<ICustomerService>(Types.CUSTOMER_SERVICE).to(CustomerService);
dIContainer.bind<ICustomerController>(Types.CUSTOMER_CONTROLLER).to(CustomerController);

dIContainer.bind<IOrderAggregateService>(Types.ORDER_AGGREGATE_SERVICE).to(OrderAggregateService);

export { dIContainer };