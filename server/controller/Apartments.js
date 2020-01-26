const express= require('express');
const mongoose = require('mongoose');
const Apartment =require('../models/Apartments');
const User =require('../models/Users');
const Requests =require('../models/Requests');
const {craeteApartmentValidation}  = require('../valdition');


class ApartmentController {
    static async craeteApartment(req,res){
         try{
            //validat the data befor create
            const {error} =  craeteApartmentValidation(req.body);
            if(error)
                return res.status(400).send(error.details[0].message);

            //chacking if the apartment is alrdy in the DB
            const apartmentExist = await Apartment.findOne({address: req.body.address ,apartmentNum:req.body.apartmentNum});
            if(apartmentExist)
               return res.status(402).send({message: 'Apartment allrady exists'});

            //create a new user
            const today=new Date()
            let apartmntData = new Apartment({ 
                _id: new mongoose.Types.ObjectId(),
                city: req.body.city,
                address: req.body.address,
                apartmentNum: req.body.apartmentNum,
                price: req.body.price,
                rooms: req.body.rooms,
                owner: req.user._id,
                status: req.body.status,
                pats: req.body.pats,
                parcking: req.body.parcking,
                neebrhood: req.body.neebrhood,
                patsaftyChacks: req.body.saftyChack,
                desciption: req.body.desciption,
                loftSize: req.body.loftSize,
                created: today
            });
            if(apartmntData){
                const saveApartment= await apartmntData.save().then(t => t.populate('owner', 'first_name last_name email').execPopulate()) 
                res.status(200).send({
                    message: 'Apartment created',
                    apartment: saveApartment
                });

            } 
            else res.status(401).send({message: 'Something went wrong craetig apartment'});
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async editeApartment2(req,res){
        try{
            //chacking if in the DB
            const userExist = await Apartment.findById({_id: req.params.apartmentId});
            if(!userExist)
                return res.status(404).send({message: 'Apartment not found'});
    
            //Udete     
            //Do it in if stats becouse i dont want to require fildes. if it cames from user so i set it. 
           
            const apartmentFileds = {};
            apartmentFileds.owner= req.user._id;
            if(req.body.city) apartmentFileds.city=req.body.city;
            if(req.body.address) apartmentFileds.address=req.body.address;
            if(req.body.price) apartmentFileds.price=req.body.price;
            if(req.body.apartmentNum) apartmentFileds.apartmentNum=req.body.apartmentNum;
            
            if(req.body.parcking) apartmentFileds.parcking=req.body.parcking;
            if(req.body.neebrhood) apartmentFileds.neebrhood=req.body.neebrhood;
            if(req.body.saftyChack) apartmentFileds.saftyChack=req.body.saftyChack;
            if(req.body.desciption) apartmentFileds.desciption=req.body.desciption;
            
            if(req.body.rooms) apartmentFileds.rooms=req.body.rooms;
            if(req.body.loftSize) apartmentFileds.loftSize=req.body.loftSize;
            if(req.body.pats) apartmentFileds.pats=req.body.pats;
            if(req.body.status) apartmentFileds.desciption=req.body.status;
            
            
            //objects of fildes
            apartmentFileds.openHouse ={};
            if(req.body.open) apartmentFileds.openHouse.open=req.body.open;
            if(req.body.public) apartmentFileds.openHouse.public=req.body.public;
            if(req.body.date) apartmentFileds.openHouse.date=req.body.date;
            if(req.body.houre) apartmentFileds.openHouse.houre=req.body.houre;
            //split into array 
            if(typeof req.body.invated !== 'undefined') {
            //Chack if the id apartment exists:
            const userExist= await User.findOne({_id: req.body.invated});
            if (!userExist) 
                    return res.status(400).send({message: 'User not exists'});
           
           
            //for(somthing?)

            ///set a requst to user whos invaited:    
            const requst =new Requests({
                _id: new mongoose.Types.ObjectId(),
                apartmnt: req.params.apartmentId,
                sending: req.user._id,
                resiving: req.body.invated,
                purpose: 'invation',
                status: 'invited'
            });
            //save in DB the requst
            await requst.save().then(t => t.populate('sending resiving', 'first_name last_name').execPopulate()) 
            apartmentFileds.openHouse.invated=req.body.invated.split(',');
        }
    
            //Update 
            const upadtUser= await Apartment.findOneAndUpdate({_id: req.params.apartmentId} , {$set: apartmentFileds}, {new: true});
            if(upadtUser)
            return res.status(200).send({message: 'Apartment updated' , Update: upadtUser });  
            
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async deleteApartment(req,res){
        try{
            const apartment = await Apartment.findById(req.params.apartmentId);
            if (!apartment) {
                res.status(404).send({message: 'Apartment not found'});
            } else {
                const remov= await Apartment.remove({_id: req.params.apartmentId })
                res.status(200).send({
                    message: 'Apartments removed sucssfuly',
                    removed: remov
                })
            }
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async getAllApartments(req,res){
        try{
            const allApartments = await Apartment.find().populate('owner', 'first_name last_name email apartmnts requests posts _id'); //get the details owner    
            if (!allApartments) { 
                res.status(404).json("Apartments not found");
            } else {
                res.status(200).json(allApartments).send({
                    message: 'All Apartments',
                    allApartments: allApartments
                })
            }
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    //by apartment id
    static async getApartmentsById(req,res){
        try{
            const apartments = await Apartment.findById(req.params.apartmentId).populate('requsts user', 'purpose'); //get the details owner  

            if(!apartments)
                return res.status(404).send({
                    message: 'Aartment not found by the id',
                })
            if(apartments == 0) //desnt work dont know why... retuns null.
                return res.status(404).send({
                    message: 'Aartments not found',
                })
            
            else return res.status(200).send({
                message: 'Aartments found sucssfuly',
                apartments: apartments
               })
        }catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async getApartmentByuser(req,res){
        try{
            const userid= req.params.userId;
            const apartments = await Apartment.find({owner: req.params.userId}).populate('owner', 'first_name last_name email'); //get the details owner  
        
            if(!apartments)
                return res.status(404).send({
                    message: 'Aartment not found by the id',
                })
            if(apartments==null) //desnt work dont know why... retuns null.
                return res.status(404).send({
                    message: 'Aartments not found',
                })
            
            else return res.status(200).send({
                message: 'Aartments found sucssfuly',
                apartments: apartments
               })
        }catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }




    static async search(req,res){
        try{
            const searchFilds = {};
            if(req.body.city) searchFilds.city=req.body.city;
            if(req.body.address) searchFilds.address=req.body.address;
            if(req.body.priceFrom) searchFilds.priceFrom=req.body.priceFrom;
            if(req.body.priceTo) searchFilds.price=req.body.priceTo;
            if(req.body.apartmentNum) searchFilds.apartmentNum=req.body.apartmentNum;
            if(req.body.parcking) searchFilds.parcking=req.body.parcking;
            if(req.body.neebrhood) searchFilds.neebrhood=req.body.neebrhood;
            if(req.body.rooms) searchFilds.rooms=req.body.rooms;
            if(req.body.loftSize) searchFilds.loftSize=req.body.loftSize;
            if(req.body.pats) searchFilds.pats=req.body.pats;
            if(req.body.status) searchFilds.desciption=req.body.status;
        
            //objects of fildes
            searchFilds.openHouse ={};
            if(req.body.open) searchFilds.openHouse.open=req.body.open;
            if(req.body.public) searchFilds.openHouse.public=req.body.public;
            if(req.body.date) searchFilds.openHouse.date=req.body.date;
            if(req.body.houre) searchFilds.openHouse.houre=req.body.houre;

            //how to handle price from to.....??

            //Find all apartments with searches
            const serches= await Apartment.find(searchFilds);
            if(serches)
                return res.status(200).send({message: 'Apartments found' , searches : serches });   
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

 



}
module.exports = ApartmentController;