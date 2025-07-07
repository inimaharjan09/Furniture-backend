import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        _id: false,
        name: String,
        image: String,
        price: Number,
        qty: Number,
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
      },
    ],
    billingInfo: {
      fname: String,
      lname: String,
      company: String,
      country: String,
      address: String,
      city: String,
      province: String,
      zip: String,
      phone: String,
      email: String,
      notes: String,
    },
    total: {
      type: Number,
      required: true,
    },
    // isPaid: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
