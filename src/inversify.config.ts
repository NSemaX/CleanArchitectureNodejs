import { Container } from "inversify";
import { Types } from "./infrastructure/utility/DiTypes";
import { OrderRepository,} from "./infrastructure/repositories/orderRepository";
import { IOrderController,OrderController,} from "./web.api/controllers/orderController";
import { ProductRepository } from "./infrastructure/repositories/productRepository";
import { IProductController,ProductController,} from "./web.api/controllers/productController";
import { OrderDetailRepository } from "./infrastructure/repositories/orderDetailRepository";
import { CustomerRepository } from "./infrastructure/repositories/customerRepository";
import { ICustomerController,CustomerController,} from "./web.api/controllers/customerController";
import { IOrderRepository } from "./domain/aggregates/orderAggregate/IOrderRepository";
import { IProductRepository } from "./domain/models/product/IProductRepository";
import { IOrderDetailRepository } from "./domain/aggregates/orderAggregate/IOrderDetailRepository";
import { ICustomerRepository } from "./domain/models/customer/ICustomerRepository";
import { IOrderDomainService, OrderDomainService } from "./domain/domain.services/orderDomainService";
import { IOrderApplicationService, OrderApplicationService } from "./application/application.services/orderApplicationService";
import { IProductApplicationService, ProductApplicationService } from "./application/application.services/productApplicationService";
import { CustomerDomainService, ICustomerDomainService } from "./domain/domain.services/customerDomainService";
import { CustomerApplicationService, ICustomerApplicationService } from "./application/application.services/customerApplicationService";


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