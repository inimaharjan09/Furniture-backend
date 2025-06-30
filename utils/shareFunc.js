export const notAllowed = (req, res) => {
  return res.status(405).json({
    message: 'Method Not Allowed',
  });
};

// export const idCheck = (res, id) => {
//     if(!mongoose.isValidObjectId(id)) return res.status(400).json({
//                 message: 'Invalid Product ID'
//             });
// }
