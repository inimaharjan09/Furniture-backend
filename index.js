//server
import express from 'express';
import morgan from 'morgan';
import productRoutes from './routes/productRoutes.js';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import userRoutes from './routes/userRoutes.js';
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
