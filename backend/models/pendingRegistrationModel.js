import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    name: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-delete after 10 minutes (600 seconds)
});

const pendingRegistrationModel = mongoose.models.pendingregistration || mongoose.model("pendingregistration", pendingRegistrationSchema);
export default pendingRegistrationModel;
