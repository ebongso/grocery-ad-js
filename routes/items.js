const express = require('express');
const mongojs = require('mongojs');
const router = express.Router();

router.get('/items', (req, res, next) => {
  req.db.collection('items').find((err, items) => {
    if(err) return res.send(err);

    res.json(items);
  });
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