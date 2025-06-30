import Joi from 'joi';
import { categories } from '../models/Product.js';
import validate from 'express-joi-validation';

export const validates = validate.createValidator({});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(40).required(),
});

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(40).required(),
});

export const productValSchema = Joi.object({
  name: Joi.string().min(0).required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  category: Joi.string()
    .valid(...categories)
    .required(),
  rating: Joi.number(),
}).unknown(true);
