const express = require('express');
const fs = require('fs');
const http = require('http');
const mongojs = require('mongojs');
const path = require('path');
const router = express.Router();

const GOitems = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/GOitems.json'), 'utf-8'));
const Luckyitems = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/Luckyitems.json'), 'utf-8'));

router.get('/items', (req, res, next) => {
  const store = req.query.store;
  let page = req.query.page;
  page = page === '' ? '1' : page;

  // req.db.collection('items').find((err, items) => {
  //   if(err) return res.send(err);

  //   res.json(items);
  // });

  let data = {
    totalPages: store === 'lucky' ? Luckyitems[0].CS_Page.length : 1,
    items: store === 'lucky' ? Luckyitems[0].CS_Page.filter(c => c.PageName === page)[0].SaleItems : 
      GOitems.items.filter(i => i.brand !== '')
  };
  res.json(data);
});

router.get('/items/load', (req, res, next) => {
  console.log(GOitems);
  res.json('done');
});

router.get('/items/refresh', (req, res, next) => {
  const callback = (response) => {
    let str = '';

    response.on('data', (chunk) => str += chunk);
    response.on('end', () => console.log(str));
  };
  http.request('http://flyers.groceryoutlet.com/flyer_data/1157470?locale=en-US', callback).end();
  res.json('done');
});

router.get('/item/:id', (req, res, next) => {
  req.db.collection('items').findOne({ _id : mongojs.ObjectId(req.params.id) }, (err, item) => {
    if(err) return res.send(err);

    res.json(item);
  });
});

router.post('/item/:id', (req, res, next) => {
  const item = req.body;
  if(!item.title || (item.isDone)) {
    res.status(400);
    res.json({ 'error' : 'Bad data' });
  } else {
    req.db.collection('items').save(item, (err, item) => {
      if(err) return res.send(err);

      res.json(item);
    });
  }
});

router.delete('/item/:id', (req, res, next) => {
  req.db.collection('items').remove({ _id : mongojs.ObjectId(req.params.id) }, (err, item) => {
    if(err) return res.send(err);

    res.json(item);
  });
});

router.put('/item/:id', (req, res, next) => {
  const item = req.body;
  let updateItem = {};

  if(item.isDone) {
    updateItem.isDone = item.isDone;
  }
  if(item.title) {
    updateItem.title = item.title;
  }
  if(updateItem) {
    req.db.collection('items').update({ _id : mongojs.ObjectId(req.params.id) }, updateItem, {}, (err, item) => {
      if(err) return res.send(err);

      res.json(item);
    });
  } else {
    res.status(400);
    res.json({ 'error' : 'Bad data' });
  }
});

module.exports = router;