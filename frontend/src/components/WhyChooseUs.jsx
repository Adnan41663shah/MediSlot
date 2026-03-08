import React from 'react'

const WhyChooseUs = () => {
  const stats = [
    { value: '25,000+', label: 'Patients Served' },
    { value: '6', label: 'Specialties Covered' },
    { value: '60 sec', label: 'Avg. Booking Time' },
    { value: '24/7', label: 'Online Booking' },
  ]

  return (
    <section className='py-10 sm:py-12 md:py-16 bg-surface-muted/60 rounded-2xl'>
      <div className='text-center mb-8 md:mb-12'>
        <h2 className='text-2xl md:text-3xl font-bold text-text-primary'>Why Patients Choose MediSlot</h2>
        <p className='mt-2 text-text-secondary max-w-2xl mx-auto text-sm md:text-base'>
          We've simplified the way India books healthcare. No more endless calls or crowded waiting rooms—just seamless, digital scheduling.
        </p>
      </div>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
        {stats.map((stat, i) => (
          <div key={i} className='text-center p-4 sm:p-6 rounded-xl bg-white border border-stone-100 shadow-card'>
            <p className='text-2xl sm:text-3xl font-bold text-primary'>{stat.value}</p>
            <p className='text-text-secondary text-sm mt-1 font-medium'>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default WhyChooseUs
