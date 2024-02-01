import express from 'express';
import orderRoutes from "../routes/orderRoutes";
import productRoutes from './productRoutes';
import customerRoutes from './customerRoutes';
import orderDetailRoutes from './orderDetailRoutes';


export const applicationRoutes = express.Router();

applicationRoutes.use('/api/customers', customerRoutes);
applicationRoutes.use('/api/products', productRoutes);
applicationRoutes.use('/api/orders', orderRoutes);
applicationRoutes.use('/api/orderdetails', orderDetailRoutes);
