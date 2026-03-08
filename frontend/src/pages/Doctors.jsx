import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'



const Doctors = () => {

  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }
  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  const specialities = ['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist']
  return (
    <div className='py-6 sm:py-8 md:py-10'>
      <div className='mb-6 sm:mb-8'>
        <h1 className='text-2xl sm:text-3xl font-bold text-text-primary'>
          {speciality ? `${speciality} Specialists` : 'Doctor Directory'}
        </h1>
        <p className='text-text-secondary mt-2 text-sm sm:text-base max-w-2xl'>
          {speciality
            ? `Browse our verified ${speciality} physicians. Select a doctor to view their profile and book an appointment.`
            : 'Explore our full directory of board-certified doctors across 6 specialties. Filter by category or browse all to find your ideal physician.'}
        </p>
      </div>
      <div className='flex flex-col md:flex-row gap-6 sm:gap-8'>
        <aside className='md:w-56 flex-shrink-0'>
          <button onClick={() => setShowFilter(!showFilter)} className={`md:hidden w-full py-2.5 px-4 rounded-xl border text-sm font-medium mb-4 ${showFilter ? 'bg-primary text-white border-primary' : 'border-stone-200'}`}>
            Filters
          </button>
          <div className={`flex flex-row md:flex-col flex-wrap gap-2 ${showFilter ? 'flex' : 'hidden md:flex'}`}>
            <button onClick={() => navigate('/doctors')} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${!speciality ? 'bg-primary text-white' : 'bg-surface-muted text-text-secondary hover:bg-primary-muted hover:text-primary'}`}>All</button>
            {specialities.map(s => (
              <button key={s} onClick={() => navigate(s === speciality ? '/doctors' : `/doctors/${s}`)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${speciality === s ? 'bg-primary text-white' : 'bg-surface-muted text-text-secondary hover:bg-primary-muted hover:text-primary'}`}>{s}</button>
            ))}
          </div>
        </aside>
        <div className='flex-1 grid grid-cols-auto gap-4 sm:gap-5 md:gap-6'>
          {filterDoc.length === 0 ? (
            <div className='col-span-full flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-center'>
              <p className='text-5xl mb-4 opacity-40'>🩺</p>
              <h3 className='text-lg sm:text-xl font-semibold text-text-primary'>
                {speciality ? `No doctors found in ${speciality}` : 'No doctors available'}
              </h3>
              <p className='text-text-secondary mt-2 text-sm sm:text-base max-w-sm'>
                {speciality
                  ? `We don't have any ${speciality} specialists available at the moment. Try browsing our full directory or check back soon—we're always adding new physicians.`
                  : 'Our doctor directory is currently empty. Please check back later—we add new specialists regularly.'}
              </p>
              {speciality && (
                <button onClick={() => navigate('/doctors')} className='btn-primary mt-6'>
                  View All Specialties
                </button>
              )}
            </div>
          ) : filterDoc.map((item, index) => (
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
      </div>
    </div>
  )
}

export default Doctors
