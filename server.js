require('dotenv').config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

const { connectDB, verifyToken } = require('./config.js')

connectDB();

app.get('/', (req,res) => {
  res.status(200).send('<h1>Hello World!</h1>')
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
