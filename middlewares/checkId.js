import mongoose from 'mongoose';
import Product from '../models/Product.js';

export const checkId = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({
      message: 'Invalid Product ID',
    });
  const isExist = await Product.findById(id);
  if (!isExist)
    return res.status(400).json({
      message: 'Product Not Found',
    });
  req.product = isExist;
  next();
};
