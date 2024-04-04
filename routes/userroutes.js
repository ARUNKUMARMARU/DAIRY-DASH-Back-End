const express = require('express');
const userController =require('../controller/usercontroller');
const authMiddleware = require('../middleware/authMiddleware');

const userRouter = express.Router();

userRouter.post('/signup',userController.signup);
userRouter.post('/signin',userController.signin);
userRouter.get('/getuser', authMiddleware,userController.getuser);
userRouter.get('/getallusers', authMiddleware,userController.getallusers);
userRouter.put('/updateuser', authMiddleware,userController.updateuser);
userRouter.patch('/updatestatus', authMiddleware,userController.updatestatus);
userRouter.put('/updateprice', authMiddleware,userController.updateprice);
userRouter.get('/getprice', authMiddleware,userController.getprice);
userRouter.get('/paymenthistries', authMiddleware,userController.paymenthistries);

module.exports=userRouter