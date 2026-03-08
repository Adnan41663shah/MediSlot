import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {

  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  return (
    <section className='py-10 sm:py-12 md:py-14 lg:py-16'>
      <div className='text-center mb-8 sm:mb-10 md:mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold text-text-primary'>Our Featured Physicians</h2>
        <p className='mt-3 text-text-secondary max-w-2xl mx-auto'>Hand-picked, verified doctors with excellent patient reviews. Book a consultation today and experience quality healthcare at your fingertips.</p>
      </div>
      <div className='grid grid-cols-auto gap-6'>
        {doctors.slice(0, 10).map((item, index) => (
          <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
            className='card overflow-hidden cursor-pointer group' key={index}>
            <div className='aspect-[4/3] bg-primary-muted overflow-hidden'>
              <img className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' src={item.image} alt={item.name} />
            </div>
            <div className='p-5'>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${item.available ? 'text-emerald-600' : 'text-text-muted'}`}>
                <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                {item.available ? 'Available' : 'Not Available'}
              </span>
              <h3 className='text-lg font-semibold text-text-primary mt-2 group-hover:text-primary transition-colors'>{item.name}</h3>
              <p className='text-text-secondary text-sm'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='text-center mt-12'>
        <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='btn-secondary'>
          Browse Full Doctor Directory
        </button>
      </div>
    </section>
  )
}

export default TopDoctors
