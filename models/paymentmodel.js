const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

    customerName : String,

    mobileNumber : Number,

    amount : Number,

    quantity : Number,

    paymentDate : String
   
  
 });

 module.exports = mongoose.model("payment",paymentSchema);