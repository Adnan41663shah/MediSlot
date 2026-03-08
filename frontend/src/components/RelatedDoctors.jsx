import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()

  const [relDoc, setRelDoc] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      )
      setRelDoc(doctorsData)
    }
  }, [doctors, speciality, docId])

  return (
    <section className='my-14 sm:my-16 md:my-20'>
      <h2 className='text-xl sm:text-2xl font-bold text-text-primary mb-2'>More {speciality} Specialists</h2>
      <p className='text-text-secondary mb-6 sm:mb-8 text-sm sm:text-base'>Explore other doctors in this specialty if you'd like more options.</p>
      <div className='grid grid-cols-auto gap-4 sm:gap-5 md:gap-6'>
        {relDoc.map((item, index) => (
          <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='card overflow-hidden cursor-pointer group' key={index}>
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
    </section>
  )
}

export default RelatedDoctors
