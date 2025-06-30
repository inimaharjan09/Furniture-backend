import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isExist = await User.findOne({ email: email });
    console.log('User Found:', isExist);
    if (!isExist)
      return res.status(404).json({
        message: 'User Not Found',
      });
    const pass = bcrypt.compareSync(password, isExist.password);
    if (!pass)
      return res.status(401).json({
        message: 'Invalid Password',
      });
    const token = jwt.sign(
      {
        id: isExist.id,
        role: isExist.role,
      },
      'secret'
    );

    return res.status(200).json({
      token,
      email: isExist.email,
      role: isExist.role,
      username: isExist.username,
      id: isExist.id,
    });
  } catch (err) {
    return res.status(400).json({
      message: `${err}`,
    });
  }
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const isExist = await User.findOne({ email: email });
    if (isExist)
      return res.status(409).json({
        message: 'User Already Exists',
      });

    const hashPassword = bcrypt.hashSync(password, 10);

    await User.create({ username, email, password: hashPassword });
    return res.status(200).json({
      message: 'User Registered Successfully',
    });
  } catch (err) {
    return res.status(400).json({
      message: `${err}`,
    });
  }
};

export const getUserProfile = async (req, res) => {
  const id = req.userId;
  try {
    const user = await User.findById(id);
    return res.status(200).json({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};

export const updateProfile = async (req, res) => {
  const { username, email } = req.body;
  const id = req.userId;
  try {
    const user = await User.findById(id);
    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

    return res.status(200).json({ message: 'profile updated successfully' });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
};
