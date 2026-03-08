import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { createPortal } from 'react-dom'
import { toast } from 'react-toastify'

const Contact = () => {
  const [showCareersForm, setShowCareersForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: '', message: '' })

  const handleCareersSubmit = (e) => {
    e.preventDefault()
    toast.success('Application received! We\'ll be in touch soon.')
    setFormData({ name: '', email: '', phone: '', role: '', message: '' })
    setShowCareersForm(false)
  }

  return (
    <div className='py-8 sm:py-10 md:py-12'>
      <div className='text-center mb-10 sm:mb-12 md:mb-16'>
        <h1 className='text-3xl md:text-4xl font-bold text-text-primary'>Get in Touch</h1>
        <p className='text-text-secondary mt-2 max-w-2xl mx-auto text-lg'>Have questions, feedback, or need assistance? We're here to help. Reach out anytime.</p>
      </div>
      <div className='flex flex-col md:flex-row gap-8 sm:gap-10 md:gap-12 items-start'>
        <img className='w-full md:max-w-md rounded-2xl shadow-soft object-cover' src={assets.contact_image} alt="Contact MediSlot" />
        <div className='flex flex-col gap-8 flex-1'>
          <div className='card p-6'>
            <h3 className='font-semibold text-text-primary text-lg mb-4'>Office & Support</h3>
            <p className='text-text-secondary mb-4 leading-relaxed'>Our team typically responds within 24 hours. For urgent matters, call us directly.</p>
            <div className='space-y-3'>
              <p className='text-text-secondary'><strong className='text-text-primary'>Address:</strong><br />Sadar Bazar, Anjuman college<br />nagpur, India</p>
              <p className='text-text-secondary'><strong className='text-text-primary'>Phone:</strong> <a href='tel:+919000090000' className='text-primary hover:underline'>+91 95292 57473</a></p>
              <p className='text-text-secondary'><strong className='text-text-primary'>Email:</strong> <a href='mailto:customersupport@medislot.in' className='text-primary hover:underline'>customersupport@medislot.in</a></p>
            </div>
          </div>
          <div className='card p-6'>
            <h3 className='font-semibold text-text-primary text-lg mb-3'>Join Our Team</h3>
            <p className='text-text-secondary mb-4'>We're always looking for talented people who care about improving healthcare. Check out our open roles and see if there's a fit for you.</p>
            <button onClick={() => setShowCareersForm(true)} className='btn-secondary w-fit'>Explore Careers</button>
          </div>
        </div>
      </div>

      {showCareersForm && createPortal(
        <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4' role='dialog' aria-modal='true' aria-labelledby='careers-form-title'>
          <div className='absolute inset-0 bg-black/50' onClick={() => setShowCareersForm(false)} aria-hidden='true' />
          <div className='relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto' onClick={e => e.stopPropagation()}>
            <div className='flex justify-between items-start mb-6'>
              <div>
                <h2 id='careers-form-title' className='text-xl font-bold text-text-primary'>Career Application</h2>
                <p className='text-text-secondary text-sm mt-1'>Tell us about yourself. We'll get back to you soon.</p>
              </div>
              <button onClick={() => setShowCareersForm(false)} className='p-2 -mr-2 rounded-lg hover:bg-stone-100 text-text-muted' aria-label='Close'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
              </button>
            </div>
            <form onSubmit={handleCareersSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-text-primary mb-1'>Full Name</label>
                <input required type='text' value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className='input-field' placeholder='e.g. Priya Sharma' />
              </div>
              <div>
                <label className='block text-sm font-medium text-text-primary mb-1'>Email</label>
                <input required type='email' value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} className='input-field' placeholder='you@example.com' />
              </div>
              <div>
                <label className='block text-sm font-medium text-text-primary mb-1'>Phone</label>
                <input type='tel' value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} className='input-field' placeholder='+91 98765 43210' />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-text-primary mb-1'>Message / Cover Note</label>
                <textarea rows={4} value={formData.message} onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))} className='input-field resize-none' placeholder='Why do you want to join MediSlot? (optional)' />
              </div>
              <div className='flex gap-3 pt-2'>
                <button type='button' onClick={() => setShowCareersForm(false)} className='btn-secondary flex-1'>Cancel</button>
                <button type='submit' className='btn-primary flex-1'>Submit Application</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default Contact
