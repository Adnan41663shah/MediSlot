/**
 * Seed doctors into the database.
 * Run: node backend/scripts/seedDoctors.js (from project root)
 * Or: cd backend && node scripts/seedDoctors.js
 *
 * For production: set MONGO_URI to your production database and run the same command
 * after deployment. The same doctors will appear.
 */
import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import doctorModel from '../models/doctorModel.js'

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/appointy'

const SEED_DOCTORS = [
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200',
    speciality: 'General physician',
    degree: 'MBBS, MD (General Medicine)',
    experience: '10 Year',
    about: 'Experienced general physician with 10+ years in primary care. Specializes in preventive medicine and chronic disease management.',
    fees: 500,
    address: { line1: 'MediCare Clinic, Sector 15', line2: 'Noida, UP 201301' },
  },
  {
    name: 'Dr. Anjali Verma',
    email: 'anjali.verma@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200',
    speciality: 'Gynecologist',
    degree: 'MBBS, MS (Obstetrics & Gynecology)',
    experience: '8 Year',
    about: 'Specialist in women\'s health, prenatal care, and gynecological procedures. Committed to comprehensive wellness for all ages.',
    fees: 800,
    address: { line1: 'Women\'s Wellness Center', line2: 'Connaught Place, Delhi 110001' },
  },
  {
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200',
    speciality: 'Dermatologist',
    degree: 'MBBS, MD (Dermatology)',
    experience: '6 Year',
    about: 'Expert in skin, hair, and nail conditions. Offers treatments for acne, eczema, and cosmetic dermatology.',
    fees: 700,
    address: { line1: 'Skin & Beauty Clinic', line2: 'Greater Kailash, Delhi 110048' },
  },
  {
    name: 'Dr. Meera Reddy',
    email: 'meera.reddy@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200',
    speciality: 'Pediatricians',
    degree: 'MBBS, MD (Pediatrics)',
    experience: '5 Year',
    about: 'Dedicated to children\'s health from birth through adolescence. Warm, child-friendly approach to care.',
    fees: 600,
    address: { line1: 'Little Stars Pediatric Clinic', line2: 'Indiranagar, Bangalore 560038' },
  },
  {
    name: 'Dr. Suresh Patel',
    email: 'suresh.patel@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200',
    speciality: 'Neurologist',
    degree: 'MBBS, DM (Neurology)',
    experience: '12 Year',
    about: 'Specialist in brain and nervous system disorders. Expert in headaches, epilepsy, stroke, and movement disorders.',
    fees: 1000,
    address: { line1: 'Neuro Care Hospital', line2: 'Bandra West, Mumbai 400050' },
  },
  {
    name: 'Dr. Kavita Nair',
    email: 'kavita.nair@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200',
    speciality: 'Gastroenterologist',
    degree: 'MBBS, MD (Gastroenterology)',
    experience: '7 Year',
    about: 'Expert in digestive system disorders, liver diseases, and endoscopy. Focus on evidence-based treatments.',
    fees: 900,
    address: { line1: 'Digestive Health Institute', line2: 'Jubilee Hills, Hyderabad 500033' },
  },
]

async function seedDoctors() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')

    const hashedPassword = await bcrypt.hash('doctor123', 10)
    let added = 0
    let skipped = 0

    for (const doc of SEED_DOCTORS) {
      const exists = await doctorModel.findOne({ email: doc.email })
      if (exists) {
        console.log(`  Skipped (exists): ${doc.name}`)
        skipped++
        continue
      }

      await doctorModel.create({
        ...doc,
        password: hashedPassword,
        date: Date.now(),
        available: true,
        slots_booked: {},
      })
      console.log(`  Added: ${doc.name}`)
      added++
    }

    console.log(`\nDone. Added: ${added}, Skipped: ${skipped}`)
  } catch (err) {
    console.error('Seed failed:', err.message)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seedDoctors()
