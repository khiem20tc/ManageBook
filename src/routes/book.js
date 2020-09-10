const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { BookEntity } = require('../models');
const { uploadBook } = require('../middlewares');

router.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });

router.post('/', uploadBook.single('book'), async(req,res) => {
  try {
    const book = new BookEntity({
    book: req.file
  });
    book.save();
    res.status(200).send(req.file);
}catch(err) {
    res.send(400).json({msg: err});;
}
})

router.get('/', async(req,res) => {
  try {
    const book = await BookEntity.find();
    res.status(200).json(book);
} catch(err) {
    res.status(400).json({msg: err});
}
})

router.put('/:id', async(req,res)=>{
  try {
      const BookUpdated = await BookEntity.updateOne(
          {_id: req.params.id}, 
          {$set: { 
              bookName: req.body.bookName,
              bookType: req.body.bookType,
              author: req.body.author
            }}
          );
      res.status(200).json({msg: 'Updated'});
  } catch(err) {
      res.json({msg: err});
  }
})

router.delete('/:id', async(req,res)=>{
  try {
      const bookRemoved = await BookEntity.remove({_id: req.params.id});
      res.status(200).json({msg: 'deleted'});
  } catch(err) {
      res.json({msg: err});
  }
})

module.exports = router;