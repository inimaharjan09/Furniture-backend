import express from 'express';
import {
  addProduct,
  deleteReview,
  getProduct,
  getProducts,
  getTop5,
  removeProduct,
  reviewProduct,
  updateProduct,
} from '../controllers/productController.js';
import { fileCheck, updateFileCheck } from '../middlewares/checkFile.js';
import { checkId } from '../middlewares/checkId.js';
import { notAllowed } from '../utils/shareFunc.js';
import { productValSchema, validates } from '../utils/validator.js';
import { adminCheck, userCheck } from '../middlewares/userCheck.js';

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(validates.body(productValSchema), fileCheck, addProduct)
  .all(notAllowed);

router.route('/top-5').get(getTop5, getProducts).all(notAllowed);

router
  .route('/:id')
  .get(checkId, getProduct)
  .patch(userCheck, adminCheck, checkId, updateFileCheck, updateProduct)
  .delete(userCheck, adminCheck, checkId, removeProduct)
  .all(notAllowed);

router
  .route('/review/:id')
  .patch(checkId, reviewProduct)
  .delete(deleteReview)
  .all(notAllowed);

export default router;
