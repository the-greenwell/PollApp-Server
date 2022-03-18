const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const connectDB = async () => {
  try {
    await mongoose.connect(
      `${process.env.MONGODB_URI}`,
      {
        useNewUrlParser: true
      }
    );
    console.log('MongoDB is Connected');
  } catch(err) {
    console.error(err.message);
    process.exit(1);
  }
};

const verifyToken = (req,res,next) => {
  const token = req.headers['x-access-token'];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.json({
      isLoggedIn: false,
      message: 'Failed To Authenticate',
      err: err
    })
    next();
  })
};

module.exports = {
  connectDB: connectDB,
  verifyToken: verifyToken,
};
