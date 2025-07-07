import express from 'express';
import { notAllowed } from '../utils/shareFunc.js';
import { userCheck } from '../middlewares/userCheck.js';
import {
  createOrder,
  getOrderDetail,
  getOrders,
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/').post(userCheck, createOrder).all(notAllowed);
router.route('/users').get(userCheck, getOrders).all(notAllowed);
router.route('/:id').get(getOrderDetail).all(notAllowed);

export default router;
