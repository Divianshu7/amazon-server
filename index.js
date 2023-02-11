import express from 'express'
const stripe = require('stripe')('sk_test_51MQjISSGH3tlMGspO34UQ3XvSLeDN97Ug8GT35S4OzZlR4Kr8psAlSSuneIfjxXp6usbN9X7CJHVpFjZE3RiJI8x00rP03AtgB')
// const cors = require('cors')
import cors from 'cors'
//Api
// const mongoose = require("mongoose")
import mongoose from 'mongoose';
import User from './Model/User';
import Order from './Model/Order';
//-App config
const app = express();
//-Middleware
const MONGO_URL = 'mongodb+srv://Divianshu7:7UEYkyN3PTU7x0hN@cluster0.bert3m3.mongodb.net/Amazon'
app.use(cors())
app.use(express.json());
//-Api routes
app.get("/", (req, res) => {
    res.status(200).send('hello world')
})
app.post('/api/register', async (req, res, next) => {
    // console.log(req.body)
    const email = req.body.email
    const password = req.body.password
    try {
        const userC = await User.findOne({ email }).exec()
        if (userC) {
            return res.json({ msg: 'Email already in use ', status: false })
        } else {
            const user = await User.create({ email, password })
            user.password = ''
            return res.json({ msg: 'User Created', user, status: true })
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
})
app.post('/api/login', async (req, res, next) => {
    // console.log(req.body)
    const email = req.body.email
    const password = req.body.password
    try {
        const userC = await User.findOne({ email }).exec()
        if (userC) {
            if (userC.password !== password) {
                return res.json({ msg: 'Invalid Password ', status: false })
            }
            userC.password = ''
            return res.json({ msg: 'Logged in', userC, status: true })
        } else {
            return res.json({ msg: 'Invalid Email ', status: false })
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
})
app.post('/api/payment/create', async (req, res) => {
    try {
        const total = req.query.total;
        // console.log(`Paymeny request recieved `, req.query)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: "INR",
            description: "just testing"
        });
        console.log(paymentIntent)
        //ok created
        res.status(201).send({
            clientSecret: paymentIntent.client_secret
        })
    } catch (err) {
        console.log("payment intent error", err)
    }
})
app.post('/api/order', async (req, res) => {
    try {
        console.log(req.body, 'done')
        const data = req.body
        if (data[0].status === 'succeeded') {
            const order = await Order.create({
                payIntent: data[0].id,
                basket: data[1].basket,
                amount: data[0].amount,
                user: data[1].email,
                createdAt: data[0].created
            })
            return res.status(200).send(order)
        } else {
            return res.status(400).send('Payment Failed')
        }
    } catch (err) {
        console.log(err)
    }
})
app.post('/api/orders', async (req, res) => {
    try {
        const user = req.body.email
        const orders = await Order.find({ user })
        return res.status(200).send(orders)
    } catch (err) {
        console.log(err)
    }
})
mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}).then(() => console.log('connected DB')).catch((err) => console.log("error is ", err))
//-Listen command
const port = 5000
const server = app.listen(port, () => console.log('Port running on', port))