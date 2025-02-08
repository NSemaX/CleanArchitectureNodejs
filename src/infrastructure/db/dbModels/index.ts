
import Order from "./orderDBModel";
import OrderDetail from "./orderDetailDBModel";
import Product from "./productDBModel";
import SequelizeConnection from "../SequelizeConnection";
import Customer from "./customerDBModel";



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

