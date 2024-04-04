const mongoose = require('mongoose')

const userSchema =new mongoose.Schema({
    name :{
        type : String,
        required : true
        
    } ,
    email : {
        type : String,
        required : true
       
    },
    passwordHash : {
        type : String,
        required : true
    } ,
    mobilenumber : {
        type : Number,
        required : true
    } ,
    address : {
        type : Object,
        required : true
    },
    pincode :{
        type : Number,
        require: true
    },

    userId : mongoose.Types.ObjectId,
      
    supplyType: String,

    supplies: {time:String, quantity:Number},

    totalQuantity : Number,

    startingDate : String,

    lastDate : String,

    status : {
        type : String,
        default : 'Pending'
    },

    price : Number,

    admin : {
        type : Boolean,
         default : false,
     }


});

module.exports = mongoose.model("user", userSchema, "users")