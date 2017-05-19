const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const express = require('express');
const mongojs = require('mongojs');
const path = require('path');

const index = require('./routes/index');
const items = require('./routes/items');

const port = 3001;
const app = express();

//Load env vars
dotenv.load({ path : '.env' });

const db = mongojs(process.env.MONGODB_URI);
app.use((req, res, next) => {
  req.db = db;
  next();
});

//View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set static folder
app.use(express.static(path.join(__dirname, 'assets')));

//Body Parser MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);
app.use('/api', items);

app.listen(process.env.PORT || port, () => {
  console.log('connected to db');
});