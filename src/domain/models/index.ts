import SequelizeConnection from "../../infrastructure/db/SequelizeConnection";
import Customer from "./customer";
import Order from "../aggregates/orderAggregate/order";
import OrderDetail from "../aggregates/orderAggregate/orderDetail";
import Product from "./product";



const sequelize = SequelizeConnection.getInstance();

// init models
Customer.initModel(sequelize);
Order.initModel(sequelize);
OrderDetail.initModel(sequelize);
Product.initModel(sequelize);


// associate models
//Customer.associateModel();
//Order.associateModel();
//OrderDetail.associateModel();


export const db = {
  sequelize,
  Customer,
  Order,
  OrderDetail,
  Product
};

export {
  Customer,
  Order,
  OrderDetail,
  Product
}

