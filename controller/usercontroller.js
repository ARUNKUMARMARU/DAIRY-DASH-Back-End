const userModel = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const paymentModel = require('../models/paymentmodel');

const userController = {
  signup :  async (req,res)=>{
        try{            
            const {name, email, password, mobilenumber, address, pincode} = req.body
          
            const exists = await userModel.findOne({email});
            if(exists){
                
              return res.json({status : 500, message : "This Mail Id Was Already Exists"})
                
            }
            const passwordHash = await bcrypt.hash(password, 10);
    
            const newUser = new userModel({
                name :name,
                email,
                passwordHash:passwordHash,
                mobilenumber,
                address,
                pincode
            });
            
           const saveduser =  await newUser.save();
          
            res.json({status : 200, message:'Registration Compleated',user:saveduser})
            
        }catch(error){
            res.status(500).json({message:error.message})
            console.log(error.message)
        }
    },
   
    signin : async(req,res)=>{
        try{
          
            const {email, password} = req.body;
            const user = await userModel.findOne({email});
           
            if(!user){
                return res.json({message:"Email Not Found"})
            }
            
            const passwordMatch = await bcrypt.compare(password,user.passwordHash);
            if(!passwordMatch){
                return res.json({message:"Incorrect Password"})
            }

            const token = jwt.sign({
                id : user._id,
                name : user.name
            }, config.JWT_SECRET, {expiresIn:"1d"});
             
            res.json({message:'signin success', token,  id : user._id, admin : user.admin})
        }catch(error){
            res.status(500).json({message:error.message})
        }
    },

    getuser : async(req,res)=>{      
      try{
        const id = req.userId;
      const user = await userModel.findById(id);   
      
      res.json({user:user})          
      } catch(error){
        res.status(500).json({'error' : error.message})
      }
    },

    getallusers : async(req,res)=>{      
      try{
          
        const users = await userModel.find({});   
        
        res.json({users:users})     
      }catch(error){
        res.status(500).json({'error' : error.message})
      }       
      },

    updateuser : async (req,res)=>{
        const id = req.userId;
        const {name, email, mobilenumber, address, pincode, supplyType,supplies,totalQuantity,startingDate,lastDate} = req.body;

        const updateduser = {
            name,
            email,
            mobilenumber,
            address,
            pincode,
            supplyType,
            supplies,
            totalQuantity,
            startingDate,
            lastDate,
            status:"Pending"
        };
    
        const details = await userModel.findByIdAndUpdate(id, updateduser);
        if(details){
            return res.json({message : "User Details Updated Successfully"});
        }else{
            return res.json({message : "User Not Found"})
        }
       
    },

    updateprice : async (req,res)=>{
      const id = req.userId;
        
        const {price} = req.body;
           
       const details = await userModel.findByIdAndUpdate(id,{price:price});
     
       
            return res.json({message : "Price Value Updated Successfully"});
     
       
    },

    getprice : async (req,res)=>{     
           
       const details = await userModel.findOne({admin:true} , {price:1})      
       
            return res.send(details);     
       
    },

    updatestatus : async (req,res)=>{       
        try{
           
          const {customerId,status} = req.body;       
             
         const details = await userModel.findByIdAndUpdate(customerId,{status:status});
       
         
              return res.json({message : "Status Updated Successfully"});
       
        }catch(error){
            return res.status(500).json({'error': error.message})
        }
         
      },

      paymenthistries : async (req,res)=>{            
       
             try{
             
              const details = await paymentModel.find({});  
            
        
              return res.json({details : details} )           
             
           
            }catch(error){
                return res.status(500).json({'error': error.message})
            }
     },
    
}
module.exports=userController