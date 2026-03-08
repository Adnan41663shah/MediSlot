import validator from 'validator'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { OAuth2Client } from 'google-auth-library'
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import pendingRegistrationModel from "../models/pendingRegistrationModel.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from 'cloudinary'  
import razorpay from 'razorpay';
import { sendOtpEmail } from '../utils/sendEmail.js';

// Step 1: Send OTP to email (user clicks "Create Account")
const sendRegistrationOtp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'An account with this email already exists. Please login.' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Remove any existing pending registration for this email
        await pendingRegistrationModel.deleteMany({ email });

        await pendingRegistrationModel.create({
            email,
            otp,
            name,
            hashedPassword,
        });

        await sendOtpEmail(email, otp);

        res.json({ success: true, message: 'OTP sent to your email. Please check your inbox.' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Step 2: Verify OTP and complete registration
const verifyOtpAndRegister = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.json({ success: false, message: 'Email and OTP are required' })
        }

        const pending = await pendingRegistrationModel.findOne({ email });
        if (!pending) {
            return res.json({ success: false, message: 'OTP expired or invalid. Please request a new OTP.' })
        }

        if (pending.otp !== otp.trim()) {
            return res.json({ success: false, message: 'Invalid OTP. Please try again.' })
        }

        const userData = {
            name: pending.name,
            email: pending.email,
            password: pending.hashedPassword,
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        await pendingRegistrationModel.deleteOne({ email });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to authenticate or register user via Google Sign-In
const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body
        const clientId = process.env.GOOGLE_CLIENT_ID

        if (!idToken) {
            return res.json({ success: false, message: 'Google token is required' })
        }
        if (!clientId) {
            console.error('GOOGLE_CLIENT_ID is not configured')
            return res.status(500).json({ success: false, message: 'Google Sign-In is not configured' })
        }

        const client = new OAuth2Client(clientId)
        const ticket = await client.verifyIdToken({
            idToken,
            audience: clientId,
        })
        const payload = ticket.getPayload()
        if (!payload || !payload.email || !payload.email_verified) {
            return res.json({ success: false, message: 'Invalid Google token. Email not verified.' })
        }

        const { sub: googleId, email, name, picture } = payload

        let user = await userModel.findOne({
            $or: [{ email }, { googleId }]
        })

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId
                if (picture) user.image = picture
                await user.save()
            } else if (picture && user.image !== picture) {
                user.image = picture
                await user.save()
            }
        } else {
            const placeholderPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10)
            user = await userModel.create({
                name: name || email.split('@')[0],
                email,
                googleId,
                image: picture || undefined,
                password: placeholderPassword,
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })
    } catch (error) {
        console.error('Google auth error:', error)
        res.json({ success: false, message: error.message || 'Google Sign-In failed' })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address || '{}'), dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        // Refresh userData snapshot in all existing appointments so age, name, etc. stay current
        const updatedUserData = await userModel.findById(userId).select('-password').lean()
        if (updatedUserData) {
            await appointmentModel.updateMany(
                { userId },
                { $set: { userData: updatedUserData } }
            )
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body

        if (!slotDate || !slotTime) {
            return res.json({ success: false, message: 'Please select a date and time for your appointment.' })
        }

        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export { sendRegistrationOtp, verifyOtpAndRegister, googleAuth, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay }