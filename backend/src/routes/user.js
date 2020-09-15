const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { UserEntity } = require('../models');
const { uploadAvatar } = require('../middlewares');
const { checkAuth } = require('../middlewares');
const { generateToken, verifyToken, hashPassword, comparePassword } = require('../utils')

router.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });

router.put('/setAvatar/:id', uploadAvatar.single('csv'), async(req,res) => {
    try {
        const userUpdated = await UserEntity.updateOne(
            {_id: req.params.id}, 
            {$set: { 
                avatar: req.file
                }}
            );
        res.status(200).send(req.file);
    }catch(err) {
        res.send(400).json({msg: err});;
    }
})

router.get('/', async(req,res)=>{
    try {
        const user = await UserEntity.find();
        res.status(200).json(user);
    } catch(err) {
        res.status(400).json({msg: err});
    }
})

router.post('/signin', async(req,res)=>{
    try {
        const hashedPassword = await hashPassword(req.body.password)
        const user = new UserEntity({
            userName: req.body.userName,
            password: hashedPassword,
            role: req.body.role
        });
        const user_ = await UserEntity.findOne({userName: req.body.userName});
        if (user_ == null) {
        const savedUser = await user.save();
        res.status(200).json(savedUser);
        }
        else res.status(400).send('User is already exist');
    } catch(err) {
        res.json({msg: err});
    }
})

router.post('/login', async(req,res)=>{
    const user = await UserEntity.findOne({userName: req.body.userName});
    console.log(user);
    if(user == null){
        return res.status(400).send('User is not found');
    }
    try {
        if (await comparePassword(req.body.password, user.password)){
            const token = await generateToken(user);
            //res.status(200).send(`Welcome ${user.userName}`);
            //res.status(200).json({token: token});
            console.log(token);
            if(user.role=="student")
            return res.status(200).render('../../frontend/views/pages/homeStudent')
            else return res.status(200).render('../../frontend/views/pages/homeTeacher')
        }
        else {
            res.status(500).send("Password wrong !! Please try again")
        }
    } catch(err) {
        res.json({msg: err});
    }
})

router.get('/:id', async(req,res)=>{
    try {
        const user = await UserEntity.findOne({_id: req.params.id});
        console.log('user', user)
        //res.status(200).json(user);
        if(user){
            return res.status(200).render('../../frontend/views/pages/profile', {user: user});
        } else {
            res.send('Error!')
        }
    } catch(err) {
        res.json({msg: err});
        res.status(404);
    }
})

router.delete('/:id', async(req,res)=>{
    try {
        const userRemoved = await UserEntity.remove({_id: req.params.id});
        res.status(200).json({msg: 'deleted'});
    } catch(err) {
        res.json({msg: err});
    }
})

router.put('/:id', async(req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userUpdated = await UserEntity.updateOne(
            {_id: req.params.id}, 
            {$set: { 
                userName: req.body.userName,
                role: req.body.role,
                password: hashedPassword}}
            );
        res.status(200).json({msg: 'Updated'});
    } catch(err) {
        res.json({msg: err});
    }
})

module.exports = router;