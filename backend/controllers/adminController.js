import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js"

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body
        const trimmedEmail = (email || '').trim()
        const trimmedPassword = (password || '').trim()

        if (trimmedEmail === process.env.ADMIN_EMAIL && trimmedPassword === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.status(400).json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl;
    if (process.env.CLOUDINARY_API_KEY && imageFile?.path) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      imageUrl = imageUpload.secure_url;
    } else {
      // Placeholder when Cloudinary is not configured
      imageUrl = 'https://img.icons8.com/fluency/96/user-male-circle.png';
    }

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now()
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.status(200).json({ success: true, message: "Doctor Added" });

  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// API for updating Doctor
const updateDoctor = async (req, res) => {
  try {
    const { docId } = req.params;
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID missing" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (speciality) updateData.speciality = speciality;
    if (degree) updateData.degree = degree;
    if (experience) updateData.experience = experience;
    if (about !== undefined) updateData.about = about;
    if (fees !== undefined) updateData.fees = Number(fees);
    if (address) updateData.address = typeof address === 'string' ? JSON.parse(address) : address;

    if (email && validator.isEmail(email)) updateData.email = email;

    if (password && password.length >= 8) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (process.env.CLOUDINARY_API_KEY && imageFile?.path) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      updateData.image = imageUpload.secure_url;
    }

    await doctorModel.findByIdAndUpdate(docId, updateData);
    res.status(200).json({ success: true, message: "Doctor updated successfully" });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// API for deleting Doctor
const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.params;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID missing" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndDelete(docId);
    res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        
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

const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all appointments list (enrich userData with current user profile for up-to-date age, name, etc.)
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({}).lean();
        const enrichedAppointments = await Promise.all(appointments.map(async (apt) => {
            const currentUser = await userModel.findById(apt.userId).select('-password').lean();
            return {
                ...apt,
                userData: currentUser ? { ...apt.userData, ...currentUser } : apt.userData
            };
        }));
        res.json({ success: true, appointments: enrichedAppointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({}).lean();
        const latest = appointments.reverse().slice(0, 5);
        const latestAppointments = await Promise.all(latest.map(async (apt) => {
            const currentUser = await userModel.findById(apt.userId).select('-password').lean();
            return {
                ...apt,
                userData: currentUser ? { ...apt.userData, ...currentUser } : apt.userData
            };
        }));

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


export {loginAdmin, addDoctor, updateDoctor, deleteDoctor, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard}