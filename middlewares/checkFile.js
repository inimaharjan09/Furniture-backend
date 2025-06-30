import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const supportedTypes = ['.png', '.jpeg', '.jpg', '.gif', '.webp'];

export const fileCheck = (req, res, next) => {
  const file = req.files?.image;
  console.log(file);

  if (file) {
    const extName = path.extname(file.name);

    if (supportedTypes.includes(extName)) {
      const imageFile = `/${uuidv4()}-${file.name}`;
      file.mv(`./uploads${imageFile}`, (err) => {
        if (err) return res.status(400).json({ message: `${err}` });
        req.image = imageFile;
        next();
      });
    } else {
      return res
        .status(400)
        .json({ message: 'please provide valid image file' });
    }
  } else {
    return res.status(400).json({ message: 'please provide image file' });
  }
};

export const updateFileCheck = (req, res, next) => {
  const file = req.files?.image;
  if (file) {
    const extName = path.extname(file.name);
    if (supportedTypes.includes(extName)) {
      const imageFile = `/${uuidv4()}-${file.name}`;
      file.mv(`./uploads${imageFile}`, (err) => {
        if (err) return res.status(400).json({ message: `${err}` });
        req.image = imageFile;
        next();
      });
    } else {
      return res
        .status(400)
        .json({ message: 'please provide valid image file' });
    }
  } else {
    next();
  }
};
