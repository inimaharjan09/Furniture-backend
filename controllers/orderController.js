import Order from '../models/Order.js';

export const getOrders = async (req, res) => {
  console.log(req.role);
  try {
    if (req.role === 'Admin') {
      const orders = await Order.find({});
      return res.status(200).json(orders);
    } else {
      const orders = await Order.find({ userId: req.userId }).select(
        '-orderItems'
      );
      return res.status(200).json(orders);
    }
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};

export const getOrderDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    return res.status(200).json(order);
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};

export const createOrder = async (req, res) => {
  console.log(req.body);
  const { total, orderItems, billingInfo } = req.body;
  try {
    await Order.create({
      total,
      orderItems,
      billingInfo,
      userId: req.userId,
    });
    return res.status(200).json({ message: 'Order Created Successfully' });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};
