# MediSlot (Appointy)

A full-stack **doctor appointment booking platform** that enables patients to book appointments with doctors, supports online and cash payments (Razorpay), and provides separate dashboards for admins, doctors, and patients.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [User Roles & Features](#user-roles--features)
- [Data Models](#data-models)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Key Flows](#key-flows)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)

---

## Overview

**MediSlot** is a healthcare appointment management system with three main applications:

| Application | Purpose | Port |
|-------------|---------|------|
| **Frontend** | Patient-facing website (browse doctors, book appointments, manage profile) | 5173 |
| **Admin** | Admin & Doctor login, dashboard, doctor CRUD, appointments management | 5174 |
| **Backend** | REST API, MongoDB, authentication, payments | 4000 |

---

## Tech Stack

### Backend
- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing
- **Cloudinary** for image storage
- **Razorpay** for online payments
- **Multer** for file uploads
- **validator** for input validation
- **Nodemailer** for OTP emails

### Frontend & Admin
- **React 19**
- **Vite**
- **React Router v7**
- **Axios** for API calls
- **Tailwind CSS**
- **React Toastify** for notifications

---

## Project Structure

```
MediSlot/
├── backend/                 # Express API server
│   ├── config/
│   │   ├── mongodb.js       # MongoDB connection
│   │   └── cloudinary.js    # Cloudinary config
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── doctorController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authAdmin.js     # Admin JWT verification
│   │   ├── authDoctor.js    # Doctor JWT verification
│   │   ├── authUser.js      # User JWT verification
│   │   └── multer.js        # File upload handling
│   ├── models/
│   │   ├── appointmentModel.js
│   │   ├── doctorModel.js
│   │   ├── pendingRegistrationModel.js
│   │   └── userModel.js
│   ├── scripts/
│   │   └── seedDoctors.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── routes/
│   │   ├── adminRoute.js
│   │   ├── doctorRoute.js
│   │   └── userRoute.js
│   ├── server.js
│   └── package.json
│
├── frontend/                # Patient-facing React app
│   ├── src/
│   │   ├── components/      # Navbar, Footer, Banner, etc.
│   │   ├── context/         # AppContext (doctors, user, token)
│   │   ├── pages/           # Home, Doctors, Login, Contact, etc.
│   │   ├── Appointment.jsx  # Appointment booking flow
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── admin/                   # Admin & Doctor dashboard
│   ├── src/
│   │   ├── components/      # Navbar, Sidebar
│   │   ├── context/         # AdminContext, DoctorContext, AppContext
│   │   ├── pages/
│   │   │   ├── Admin/       # Dashboard, AddDoctor, EditDoctor, DoctorsList, AllAppointments
│   │   │   ├── Doctor/      # DoctorDashboard, DoctorAppointments, DoctorProfile
│   │   │   └── Login.jsx    # Admin & Doctor login
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                      │
├─────────────────────┬──────────────────────┬─────────────────────────────┤
│   Frontend (5173)   │   Admin Panel (5174)  │                             │
│   Patient portal    │   Admin + Doctor      │                             │
└─────────┬───────────┴──────────┬───────────┴─────────────────────────────┘
          │                      │
          │   HTTP/REST          │   HTTP/REST
          │   (Axios)            │   (Axios)
          ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Express, port 4000)                       │
│  /api/user/*  │  /api/admin/*  │  /api/doctor/*                          │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
   ┌─────────────┐      ┌──────────────┐      ┌──────────────┐
   │  MongoDB    │      │  Cloudinary  │      │  Razorpay    │
   │  (Data)     │      │  (Images)    │      │  (Payments)  │
   └─────────────┘      └──────────────┘      └──────────────┘
```

- **Stateless API**: JWT in headers for auth; no server-side sessions.
- **Role-based routing**: Separate route groups for user, admin, doctor.
- **Shared backend**: One API serves both frontend and admin apps.

---

## User Roles & Features

### Patient (Frontend)
- Browse doctors by speciality
- Register (OTP email verification) / Login / Google Sign-In
- Update profile (name, phone, DOB, gender, address, image)
- Book appointments (select date & time slot)
- Pay online (Razorpay) or choose cash
- View and cancel appointments
- View doctor list and details

### Admin (Admin Panel)
- Login with admin credentials
- Dashboard (stats: doctors, appointments, revenue)
- Add, edit, delete doctors
- Change doctor availability
- View all appointments
- Cancel appointments

### Doctor (Admin Panel)
- Login with doctor credentials
- Dashboard (stats: appointments, revenue)
- View appointments list
- Complete or cancel appointments
- Edit profile (name, image, about, etc.)

---

## Data Models

### User
| Field    | Type   | Description                    |
|----------|--------|--------------------------------|
| name     | String | Required                       |
| email    | String | Unique, required               |
| password | String | Bcrypt hashed                  |
| image    | String | URL (Cloudinary or default)    |
| phone    | String | Default: '000000000'           |
| address  | Object | { line1, line2 }               |
| gender   | String | Default: 'Not Selected'        |
| dob      | String | Date of birth                  |

### Doctor
| Field        | Type    | Description                         |
|--------------|---------|-------------------------------------|
| name         | String  | Required                            |
| email        | String  | Unique, required                    |
| password     | String  | Bcrypt hashed                       |
| image        | String  | Required (Cloudinary URL)           |
| speciality   | String  | e.g. General physician, Gynecologist|
| degree       | String  | e.g. MBBS, MD                       |
| experience   | String  | e.g. 5 Year                         |
| about        | String  | Bio                                 |
| fees         | Number  | Consultation fee                    |
| available    | Boolean | Default: true                       |
| address      | Object  | { line1, line2 }                    |
| slots_booked | Object  | { "7_3_2026": ["10:00 AM", ...] }   |
| date         | Number  | Created timestamp                   |

### Appointment
| Field    | Type    | Description                        |
|----------|---------|------------------------------------|
| userId   | String  | User ID                            |
| docId    | String  | Doctor ID                          |
| slotDate | String  | Format: "7_3_2026" (D_M_YYYY)      |
| slotTime | String  | e.g. "10:00 AM"                    |
| userData | Object  | Snapshot of user info              |
| docData  | Object  | Snapshot of doctor info            |
| amount   | Number  | Fees                               |
| date     | Number  | Booking timestamp                  |
| cancelled| Boolean | Default: false                     |
| payment  | Boolean | true = Online, false = Cash        |
| isCompleted | Boolean | Default: false                  |

### PendingRegistration (OTP flow)
| Field          | Type   | Description                                |
|----------------|--------|--------------------------------------------|
| email          | String | Required                                   |
| otp            | String | 6-digit OTP                                |
| name           | String | Required                                   |
| hashedPassword | String | Bcrypt hashed password                      |
| createdAt      | Date   | Auto-expires after 10 minutes (TTL index)   |

---

## API Reference

### User APIs (`/api/user`)
| Method | Endpoint               | Auth  | Description                    |
|--------|------------------------|-------|--------------------------------|
| POST   | /register/send-otp     | No    | Send OTP to email for registration |
| POST   | /register/verify-otp   | No    | Verify OTP and complete registration |
| POST   | /auth/google           | No    | Authenticate via Google Sign-In |
| POST   | /login                 | No    | Login user                    |
| GET    | /get-profile           | User  | Get profile              |
| POST   | /update-profile        | User  | Update profile + image   |
| POST   | /book-appointment      | User  | Book appointment         |
| GET    | /appointments          | User  | List user appointments   |
| POST   | /cancel-appointment    | User  | Cancel appointment       |
| POST   | /payment-razorpay      | User  | Create Razorpay order    |
| POST   | /verifyRazorpay        | User  | Verify payment           |

### Admin APIs (`/api/admin`)
| Method | Endpoint              | Auth  | Description                |
|--------|-----------------------|-------|----------------------------|
| POST   | /login                | No    | Admin login                |
| POST   | /add-doctor           | Admin | Add doctor                 |
| POST   | /update-doctor/:docId | Admin | Update doctor              |
| DELETE | /delete-doctor/:docId | Admin | Delete doctor              |
| GET    | /all-doctors          | Admin | List all doctors           |
| POST   | /change-availability  | Admin | Toggle doctor availability |
| GET    | /appointments         | Admin | List all appointments      |
| POST   | /cancel-appointment   | Admin | Cancel appointment         |
| GET    | /dashboard            | Admin | Dashboard stats            |

### Doctor APIs (`/api/doctor`)
| Method | Endpoint              | Auth   | Description            |
|--------|-----------------------|--------|------------------------|
| POST   | /login                | No     | Doctor login           |
| GET    | /list                 | No     | Public doctor list     |
| GET    | /appointments         | Doctor | Doctor's appointments  |
| POST   | /cancel-appointment   | Doctor | Cancel appointment     |
| POST   | /complete-appointment | Doctor | Mark completed         |
| POST   | /change-availability  | Doctor | Toggle availability    |
| GET    | /dashboard            | Doctor | Dashboard stats        |
| GET    | /profile              | Doctor | Get profile            |
| POST   | /update-profile       | Doctor | Update profile         |

---

## Authentication

- **User**: JWT with `{ id: userId }`; sent in `token` header; verified by `authUser`.
- **Admin**: JWT signed with `ADMIN_EMAIL + ADMIN_PASSWORD`; sent in `aToken` header; verified by `authAdmin`.
- **Doctor**: JWT with `{ id: docId }`; sent in `Authorization: Bearer <token>` or `dtoken` header; verified by `authDoctor`.

Tokens are stored in `localStorage` on the client and sent with each authenticated request.

---

## Key Flows

### 1. User registration (OTP)
1. User enters name, email, password and requests OTP.
2. Backend validates, hashes password, stores pending registration with 6-digit OTP (expires in 10 minutes).
3. OTP is emailed via Nodemailer (Gmail/SMTP).
4. User enters OTP; backend verifies and creates user account.
5. JWT returned for immediate login.

### 2. Appointment booking
1. User selects doctor and date.
2. Frontend shows available time slots (derived from doctor's `slots_booked`).
3. User chooses slot and payment (Online/Cash).
4. If Online: create Razorpay order → user pays → verify payment → create appointment.
5. If Cash: create appointment directly.
6. Backend updates doctor's `slots_booked` and creates appointment document.

### 3. Slot format
- `slotDate`: `"7_3_2026"` (day_month_year).
- Slots: e.g. `"10:00 AM"`, `"10:30 AM"` (defined in frontend logic).

### 4. Doctor availability
- `available`: boolean flag; when false, doctor is hidden from booking.
- `change-availability` API toggles this flag.

### 5. Image uploads
- Profile and doctor images go through Multer (local temp) → Cloudinary.
- Cloudinary returns URL; URL stored in DB.
- If Cloudinary is not configured, a placeholder URL is used.

---

## Environment Variables

### Backend (`.env`)
```env
MONGO_URI=mongodb://localhost:27017/appointy
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
RAZORPAY_KEY_ID=rzp_xxx
RAZORPAY_KEY_SECRET=xxx
CLOUDINARY_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_SECRET_KEY=xxx
# Email (for user registration OTP verification - Gmail: enable 2FA, then create App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
# Google Sign-In (from Google Cloud Console > APIs & Services > Credentials)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
PORT=4000
```

### Frontend (`.env`)
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=rzp_xxx
VITE_CURRENCY=₹
# Same Client ID as backend (Web application type in Google Cloud Console)
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

### Admin (`.env`)
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=₹
```

---

### Google Sign-In Setup (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
4. Application type: **Web application**
5. Add authorized JavaScript origins: `http://localhost:5173`, `http://127.0.0.1:5173`, and your production URL (use the exact URL you visit)
6. Copy the **Client ID** and add it to:
   - Backend `.env` as `GOOGLE_CLIENT_ID`
   - Frontend `.env` as `VITE_GOOGLE_CLIENT_ID`

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay account (for online payments)
- Cloudinary account (for images)
- Google Cloud project with OAuth 2.0 credentials (for Google Sign-In; optional)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MediSlot
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env   # if available, else create .env
   # Edit .env with your values
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env   # if available
   # Edit .env
   ```

4. **Seed doctors (optional)** – add sample doctors to the database
   ```bash
   cd backend
   npm run seed:doctors
   ```
   Uses `MONGO_URI` from `.env`. Safe to run multiple times (skips existing emails).

5. **Admin**
   ```bash
   cd admin
   npm install
   cp .env.example .env   # if available
   # Edit .env
   ```

---

### Seeding doctors for production

After deployment, run the seed script with your **production** `MONGO_URI`:

```bash
cd backend
MONGO_URI="your_production_mongodb_uri" npm run seed:doctors
```

Or add this as a one-time post-deploy step in your hosting platform (Railway, Render, etc.). The same 6 sample doctors will be added.

---

## Running the Project

Use three terminals:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend (patient)
cd frontend && npm run dev

# Terminal 3 - Admin (admin + doctor)
cd admin && npm run dev
```

| App    | URL                      |
|--------|--------------------------|
| Backend| http://localhost:4000    |
| Frontend | http://localhost:5173  |
| Admin  | http://localhost:5174    |

---

## License

ISC
