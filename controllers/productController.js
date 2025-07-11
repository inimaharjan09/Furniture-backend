import fs from 'fs';
import Product, { categories } from '../models/Product.js';

export const getTop5 = (req, res, next) => {
  req.query.rating = { $gt: 4.5 };
  req.query.limit = 5;
  next();
};
export const getProducts = async (req, res) => {
  try {
    const queryObject = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'skip', 'search'];
    excludeFields.forEach((label) => delete queryObject[label]);
    //console.log(req.query);
    // let queryStr = JSON.stringify(queryObject);
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|eq|ne)\b/g, match => `$${match}`);
    // const finalQuery = JSON.parse(queryStr);
    if (req.query.search) {
      const searchText = req.query.search.toLowerCase();
      if (categories.includes(searchText)) {
        queryObject.category = { $regex: searchText, $options: 'i' };
      } else {
        queryObject.name = { $regex: searchText, $options: 'i' };
      }
    }
    console.log(queryObject);
    let query = Product.find(queryObject);

    if (req.query.sort) {
      const sorting = req.query.sort
        .split(/[\s,]+/)
        .filter(Boolean)
        .join(' ');
      query.sort(sorting);
    }

    if (req.query.fields) {
      const selects = req.query.fields.split(/[s,]+/).filter(Boolean).join(' ');
      query.select(selects);
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * 20;

    const products = await query
      .skip(skip)
      .limit(limit)
      .select('name rating price image');

    return res.status(200).json(products);
  } catch (err) {
    return res.status(400).json({
      message: `${err}`,
    });
  }
};

export const getProduct = (req, res) => {
  try {
    return res.status(200).json(req.product);
  } catch (err) {
    return res.status(500).json({ message: `${err}` });
  }
};

export const addProduct = async (req, res) => {
  //console.log(req.body);
  const { name, price, description, category, color, size } = req.body;

  try {
    await Product.create({
      name,
      price,
      description,
      category,
      image: req.image,
      color,
      size,
    });

    return res.status(200).json({
      message: 'Product Added Successfully',
    });
  } catch (err) {
    fs.unlink(`./uploads/${req.image}`, (imageErr) => {
      return res.status(400).json({
        message: `${err}`,
      });
    });
  }
};

export const updateProduct = async (req, res) => {
  const product = req.product;
  const { name, category, price, description, color, size } = req.body;
  try {
    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price || product.price;
    product.description = description || product.description;
    product.color = color || product.color;
    product.size = size || product.size;
    if (req.image) {
      fs.unlink(`./uploads/${product.image}`, async (err) => {
        product.image = req.image;
        await product.save();
      });
    } else {
      await product.save();
    }
    return res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    fs.unlink(`./uploads/${req.image}`, (imageErr) => {
      return res.status(400).json({
        message: `${err}`,
      });
    });
  }
};

export const removeProduct = (req, res) => {
  const product = req.product;
  try {
    fs.unlink(`./uploads/${product.image}`, async (imageErr) => {
      if (imageErr)
        return res.status(400).json({
          message: `${imageErr}`,
        });

      await Product.findByIdAndDelete(product._id);
      return res.status(200).json({ message: 'Product Removed Successfully' });
    });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};

export const reviewProduct = async (req, res) => {
  const { id } = req.params;
  const { username, rating, comment } = req.body;
  console.log(req.body);
  try {
    const isExist = await Product.findById(id);
    if (!isExist) return res.status(404).json({ message: 'Product not Found' });

    isExist.reviews.push({ username, rating, comment });
    const avgRating =
      isExist.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
      isExist.reviews.length;
    isExist.rating = avgRating;
    await isExist.save();
    return res.status(200).json({ message: 'review added successfully' });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};
export const deleteReview = async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  try {
    const isExist = await Product.findById(id);
    if (!isExist) return res.status(404).json({ message: 'Product not found' });

    const index = isExist.reviews.findIndex((r) => r.username === username);
    if (index === -1)
      return res.status(404).json({ message: 'Review not found' });

    isExist.reviews.splice(index, 1);

    isExist.rating =
      isExist.reviews.length > 0
        ? isExist.reviews.reduce((acc, r) => acc + r.rating, 0) /
          isExist.reviews.length
        : 0;

    await isExist.save();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
};
