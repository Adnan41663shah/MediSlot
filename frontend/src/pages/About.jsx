import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  const features = [
    { title: 'Lightning-Fast Booking', desc: 'No more endless hold music. Book appointments in under 60 seconds with our intuitive platform—select your doctor, pick a slot, and you\'re done.', icon: '⚡' },
    { title: 'Verified Specialists', desc: 'Every doctor on our platform is credentialed and vetted. Browse real patient reviews, qualifications, and availability before you book.', icon: '📍' },
    { title: 'Smart Reminders', desc: 'Never miss an appointment again. We send email and in-app reminders so you stay on top of your health—and your schedule.', icon: '✨' },
  ]
  return (
    <div className='py-8 sm:py-10 md:py-12'>
      <div className='text-center mb-10 sm:mb-12 md:mb-16'>
        <h1 className='text-3xl md:text-4xl font-bold text-text-primary'>About MediSlot</h1>
        <p className='text-text-secondary mt-2 max-w-2xl mx-auto text-lg'>We're on a mission to make healthcare accessible, transparent, and stress-free for everyone.</p>
      </div>
      <div className='flex flex-col md:flex-row gap-8 sm:gap-10 md:gap-12 items-center mb-14 sm:mb-16 md:mb-20'>
        <img className='w-full md:max-w-md rounded-2xl shadow-soft object-cover' src={assets.about_image} alt="MediSlot team" />
        <div className='flex flex-col gap-6 text-text-secondary'>
          <p className='leading-relaxed text-base md:text-lg'>MediSlot was founded to solve a simple but frustrating problem: scheduling doctor appointments shouldn't require multiple phone calls, long wait times, or uncertainty about availability. We built a platform that puts you in control—browse doctors by specialty, see real-time availability, and book instantly.</p>
          <p className='leading-relaxed text-base md:text-lg'>Today, we connect thousands of patients with trusted physicians across India. From general checkups to specialist consultations, we're committed to delivering a seamless experience that respects your time and puts your health first.</p>
          <div className='bg-primary-muted/50 rounded-xl p-5 border border-primary/10'>
            <h3 className='font-semibold text-text-primary mb-2 text-lg'>Our Vision</h3>
            <p className='leading-relaxed'>To become India's most trusted healthcare scheduling platform—where every patient can access quality care with the same ease as ordering dinner online.</p>
          </div>
        </div>
      </div>
      <div className='mb-8'>
        <h2 className='text-2xl md:text-3xl font-bold text-text-primary'>Why Patients Choose MediSlot</h2>
        <p className='text-text-secondary mt-2 max-w-xl'>Three pillars that make our platform different.</p>
      </div>
      <div className='grid md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-16 sm:mb-20 md:mb-24'>
        {features.map((f, i) => (
          <div key={i} className='card p-8 hover:border-primary/30 hover:shadow-card-hover group cursor-pointer transition-all'>
            <span className='text-3xl mb-4 block'>{f.icon}</span>
            <h3 className='font-semibold text-text-primary text-lg group-hover:text-primary transition-colors'>{f.title}</h3>
            <p className='text-text-secondary mt-2'>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default About
