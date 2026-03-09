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
  {
    name: 'Dr. Vikram Singh',
    email: 'vikram.singh@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1612349316228-5942a9b489c2?w=200',
    speciality: 'Cardiologist',
    degree: 'MBBS, MD (Medicine), DM (Cardiology)',
    experience: '14 Year',
    about: 'Senior cardiologist specializing in heart diseases, hypertension, and interventional procedures. Trained at premier institutes and committed to preventive cardiology. Provides comprehensive care for heart failure, arrhythmias, and post-operative cardiac rehabilitation. Focus on patient education and lifestyle modification for long-term heart health.',
    fees: 1200,
    address: { line1: 'Heart Care Center', line2: 'Defence Colony, Delhi 110024' },
  },
  {
    name: 'Dr. Neha Gupta',
    email: 'neha.gupta@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200',
    speciality: 'Orthopedic Surgeon',
    degree: 'MBBS, MS (Orthopedics), DNB (Orthopedics)',
    experience: '11 Year',
    about: 'Expert in joint replacement, sports injuries, and spine care. Performs arthroscopic surgeries and manages fractures with modern minimally invasive techniques. Passionate about helping patients regain mobility and return to an active lifestyle. Special interest in knee and hip replacements and sports medicine.',
    fees: 1100,
    address: { line1: 'Bone & Joint Hospital', line2: 'Punjagutta, Hyderabad 500082' },
  },
  {
    name: 'Dr. Arun Menon',
    email: 'arun.menon@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200',
    speciality: 'Psychiatrist',
    degree: 'MBBS, MD (Psychiatry), DPM',
    experience: '9 Year',
    about: 'Experienced psychiatrist focusing on anxiety, depression, bipolar disorder, and addiction. Uses a combination of medication management and psychotherapy. Trained in cognitive behavioral therapy and mindfulness-based approaches. Committed to reducing stigma and providing compassionate, confidential mental health care in a safe environment.',
    fees: 850,
    address: { line1: 'Mind Wellness Clinic', line2: 'Koramangala, Bangalore 560034' },
  },
  {
    name: 'Dr. Sneha Iyer',
    email: 'sneha.iyer@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200',
    speciality: 'Ophthalmologist',
    degree: 'MBBS, MS (Ophthalmology), FRCS',
    experience: '8 Year',
    about: 'Specialist in eye care including cataract surgery, glaucoma management, and retinal diseases. Proficient in LASIK and other refractive surgeries. Provides comprehensive eye exams and treats diabetic retinopathy, macular degeneration, and pediatric eye disorders. Emphasizes preventive care and early detection to preserve vision for life.',
    fees: 750,
    address: { line1: 'Vision Care Hospital', line2: 'Anna Nagar, Chennai 600040' },
  },
  {
    name: 'Dr. Mohan Das',
    email: 'mohan.das@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200',
    speciality: 'ENT Specialist',
    degree: 'MBBS, MS (ENT), DLO',
    experience: '10 Year',
    about: 'Ear, nose, and throat specialist with expertise in sinus surgery, hearing loss, tonsillectomy, and voice disorders. Skilled in endoscopic procedures and cochlear implants. Treats allergies, sleep apnea, and head-neck conditions. Provides both surgical and non-surgical options with a focus on minimally invasive techniques for faster recovery.',
    fees: 800,
    address: { line1: 'ENT Excellence Clinic', line2: 'Salt Lake, Kolkata 700091' },
  },
  {
    name: 'Dr. Pooja Bhatia',
    email: 'pooja.bhatia@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200',
    speciality: 'Pulmonologist',
    degree: 'MBBS, MD (Medicine), DM (Pulmonology)',
    experience: '7 Year',
    about: 'Pulmonologist specializing in respiratory diseases including asthma, COPD, interstitial lung disease, and sleep disorders. Experienced in bronchoscopy and critical care. Manages tuberculosis, lung cancer screening, and post-COVID recovery. Committed to helping patients breathe better through personalized treatment plans and pulmonary rehabilitation programs.',
    fees: 900,
    address: { line1: 'Lung Care Center', line2: 'Vashi, Navi Mumbai 400703' },
  },
  {
    name: 'Dr. Ravi Krishnan',
    email: 'ravi.krishnan@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200',
    speciality: 'Urologist',
    degree: 'MBBS, MS (General Surgery), MCh (Urology)',
    experience: '12 Year',
    about: 'Urologist with expertise in kidney stones, prostate disorders, urinary incontinence, and urologic oncology. Skilled in minimally invasive and robotic surgeries. Treats male infertility, erectile dysfunction, and pediatric urological conditions. Focus on evidence-based care with modern diagnostic and therapeutic approaches for comprehensive urological health.',
    fees: 1000,
    address: { line1: 'Uro Care Clinic', line2: 'T Nagar, Chennai 600017' },
  },
  {
    name: 'Dr. Ananya Roy',
    email: 'ananya.roy@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200',
    speciality: 'Rheumatologist',
    degree: 'MBBS, MD (Medicine), DM (Rheumatology)',
    experience: '6 Year',
    about: 'Rheumatologist specializing in autoimmune and musculoskeletal disorders including rheumatoid arthritis, lupus, and osteoporosis. Expert in joint injections and biologic therapies. Focuses on early diagnosis and aggressive treatment to prevent disability. Committed to improving quality of life through personalized management of chronic rheumatic conditions.',
    fees: 950,
    address: { line1: 'Joint & Arthritis Clinic', line2: 'Park Street, Kolkata 700016' },
  },
  {
    name: 'Dr. Karthik Rao',
    email: 'karthik.rao@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200',
    speciality: 'Endocrinologist',
    degree: 'MBBS, MD (Medicine), DM (Endocrinology)',
    experience: '9 Year',
    about: 'Endocrinologist expert in diabetes, thyroid disorders, hormonal imbalances, and metabolic diseases. Manages obesity, osteoporosis, and adrenal conditions. Committed to comprehensive diabetes care including insulin pump therapy and continuous glucose monitoring. Focus on patient education and lifestyle interventions for long-term metabolic health and wellbeing.',
    fees: 900,
    address: { line1: 'Hormone Health Center', line2: 'HSR Layout, Bangalore 560102' },
  },
  {
    name: 'Dr. Shruti Desai',
    email: 'shruti.desai@medislot.in',
    password: 'doctor123',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200',
    speciality: 'Nephrologist',
    degree: 'MBBS, MD (Medicine), DM (Nephrology)',
    experience: '8 Year',
    about: 'Nephrologist specializing in kidney diseases, hypertension, and dialysis. Manages acute and chronic kidney failure, electrolyte disorders, and kidney transplantation. Skilled in kidney biopsies and peritoneal dialysis. Focus on slowing disease progression and providing holistic care for patients with kidney-related conditions and their families.',
    fees: 1000,
    address: { line1: 'Kidney Care Institute', line2: 'Satellite, Ahmedabad 380015' },
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
