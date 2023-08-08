const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./database');
const users = require('./routes/User');
const cars = require('./routes/Car'); 
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/cars', cars);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});