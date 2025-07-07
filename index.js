//server
import express from 'express';
import morgan from 'morgan';
import productRoutes from './routes/productRoutes.js';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

//create express
const app = express();

//start server
mongoose
  .connect(process.env.MONGO_URI)
  .then((val) => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Database connected & Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
  })
);
app.use(express.static('uploads'));

//routes
app.get('/', (req, res) => {
  console.log(req.body);
  return res.status(200).json({
    message: 'Welcome to BACKEND',
  });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
