const express= require('express');
const profile = express.Router();
const control = require('../controller/Profile');
const vertify = require('../config/verifyToken');

//Most parivte - user must be login . 

profile.get('/',vertify, (req,res)=>{
    control.profileUser(req,res);
});

profile.get('/user/:userId', (req,res)=>{
    control.profileUserById(req,res);
});

profile.get('/all/', (req,res)=>{
    control.getAllProfile(req,res);
});

profile.post('/',vertify, (req,res)=>{
    control.createProfile(req,res);
});

profile.put('/',vertify, (req,res)=>{
    control.updeateProfile(req,res);
});


profile.post('/myRentals/add', vertify, (req,res)=>{
    control.myReantalAdd(req,res);
});

profile.delete('/myRentals/deleteOne/:rentId', vertify, (req,res)=>{
    control.myReantalDelete(req,res);
});

profile.delete('/deleteUser', vertify, (req,res)=>{
    control.Deleteuser(req,res);
});

module.exports =profile