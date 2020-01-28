const mongoose =require('mongoose');
const { Schema, model } = require('mongoose');

const ProfileSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref:'Users'},
    apartmnts: [{ apartmnt: {type:mongoose.Schema.Types.ObjectId, ref:'Apartments'} }], //list of my apartmrnts Or list of my favorits

    loction: {type: String},
    status: { type: String  } ,
    disciption: { type: String } ,
    
    myReantals: [
        {
            address: {type: String},
            city: {type: String},
            from: { type: Date, default: Date.now},
            to: { type: Date, default: Date.now},
            leftCose: {type: String},
            current: {type: String}
         }
    ], /// if im owner my history rants , if im user history rantal hoses i've been in  .
    
    aboutMe: 
    {
        lives: {type: String},
        from: {type: String},
        age: {type: String},
        job: {type: String},
        jobTime: {type: String},
        money: {type: String},
        education: {type: String},
        relationship:{type: String},
        kids:{type: Number}
    },
    social: {
        twitter: {type: String},
        faceboke: {type: String},
        youtob: {type: String}
    }

}, { collection: 'profiles' });



const Profiles = mongoose.model( 'Profiles' , ProfileSchema); 
module.exports = Profiles;

