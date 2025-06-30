import express from 'express';
import {
  addProduct,
  getProduct,
  getProducts,
  getTop5,
  removeProduct,
  updateProduct,
} from '../controllers/productController.js';
import { fileCheck, updateFileCheck } from '../middlewares/checkFile.js';
import { checkId } from '../middlewares/checkId.js';
import { notAllowed } from '../utils/shareFunc.js';
import { productValSchema, validates } from '../utils/validator.js';

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
  .patch(checkId, updateFileCheck, updateProduct)
  .delete(checkId, removeProduct)
  .all(notAllowed);

export default router;
