import nodemailer from 'nodemailer';

const createTransporter = () => {
  // Use Gmail with App Password if EMAIL_USER and EMAIL_APP_PASSWORD are set
  if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }
  // Generic SMTP (e.g., Mailtrap, SendGrid, etc.)
  if (process.env.SMTP_HOST && process.env.EMAIL_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD || process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

export const sendOtpEmail = async (toEmail, otp) => {
  const transporter = createTransporter();
  if (!transporter) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV] OTP for ${toEmail}: ${otp}`);
      return;
    }
    console.warn('Email not configured. Set EMAIL_USER and EMAIL_APP_PASSWORD in .env');
    throw new Error('Email service is not configured. Please contact support.');
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Verify your email - MediSlot',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #2563eb;">MediSlot - Email Verification</h2>
        <p>Your One-Time Password (OTP) to complete registration is:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #1e40af;">${otp}</p>
        <p style="color: #6b7280; font-size: 14px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
        <p style="color: #6b7280; font-size: 14px;">If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">MediSlot - Your Healthcare Appointment Partner</p>
      </div>
    `,
    text: `Your OTP for MediSlot registration is: ${otp}. Valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
