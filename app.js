const express = require('express');
const cors = require('cors');
const chat = require('./chat');
const stripe = require('stripe');
const authMiddleware = require('./middleware/authMiddleware');
const userModel = require('./models/usermodel');
const paymentSchema = require('./models/paymentmodel');

const userRouter = require('./routes/userroutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', userRouter);


const stripeSecretKey = "sk_test_51OzXnMCUbbaYImFXggQNTvLRCfQQfVLCojWJfG6D0ejf88CuTi0MIPFqhwv2LXSjqxwhgrTwWF1NkkFminj5esmc00atXUXtZ6";

const stripeInstance = stripe(stripeSecretKey);

app.post("/api/payment",authMiddleware,async (req, res) => {   
    try {
        const userid = req.userId;
        const { amount, quantity } = req.body;           
       
        const user = await userModel.findById(userid);

        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Milk', 
                    },
                    unit_amount: amount * 80 * quantity, 
                },
                quantity: Math.ceil(quantity), 
            }],
            mode: "payment",           

             success_url: "http://localhost:5173/dashboard",
            cancel_url: "http://localhost:5173/dashboard",
        });    
        const date = new Date()
        const payment = new paymentSchema({
            customerName : user.name,
            mobileNumber : user.mobilenumber,
            amount : amount *  quantity,
            quantity : quantity,
            paymentDate : date.toDateString()
        })    
       
        payment.save();            
        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ error: 'Failed to create session' });
    }
});

chat(app); 
