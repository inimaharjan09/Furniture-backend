//server
import express from 'express';
import morgan from 'morgan';
import productRoutes from './routes/productRoutes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

//create express
const app = express();

//start server
mongoose
  .connect(process.env.MONGO_URI)
  .then((val) => {
    app.listen(5000, () => {
      console.log('Database connected and Server is listening');
    });
  })
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use(morgan('dev'));
app.use(express.json());

//routes
app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Welcome to BACKEND',
  });
});

app.use(productRoutes);
