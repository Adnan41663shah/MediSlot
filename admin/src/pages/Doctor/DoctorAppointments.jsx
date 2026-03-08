import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {
  const [actioningId, setActioningId] = useState(null)
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  const handleCancel = async (id) => {
    if (actioningId) return
    setActioningId(id)
    try {
      await cancelAppointment(id)
    } finally {
      setActioningId(null)
    }
  }

  const handleComplete = async (id) => {
    if (actioningId) return
    setActioningId(id)
    try {
      await completeAppointment(id)
    } finally {
      setActioningId(null)
    }
  }

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className='w-full max-w-6xl p-4 sm:p-6 lg:p-8 overflow-x-auto'>
      <h1 className='text-xl sm:text-2xl font-bold text-text-primary mb-4 sm:mb-6'>Appointments</h1>
      <div className='card overflow-hidden'>
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-4 py-4 px-6 bg-stone-50 border-b border-stone-100 text-text-muted text-sm font-medium'>
          <span>#</span><span>Patient</span><span>Payment</span><span>Age</span><span>Date & Time</span><span>Fees</span><span>Action</span>
        </div>
        <div className='max-h-[75vh] overflow-y-auto'>
          {appointments.map((item, index) => (
            <div className='flex flex-wrap sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-4 items-center py-4 px-6 border-b border-stone-100 last:border-0 hover:bg-stone-50/50 text-text-secondary text-sm' key={index}>
              <span className='max-sm:hidden'>{index+1}</span>
              <div className='flex items-center gap-2'><img src={item.userData.image} className='w-9 h-9 rounded-lg object-cover' alt="" /><span className='font-medium text-text-primary'>{item.userData.name}</span></div>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${item.payment ? 'bg-primary-muted text-primary' : 'bg-stone-100 text-text-muted'}`}>{item.payment ? 'Online' : 'Cash'}</span>
              <span className='max-sm:hidden'>{calculateAge(item.userData.dob)}</span>
              <span>{slotDateFormat(item.slotDate)}, {item.slotTime}</span>
              <span>{currency}{item.amount}</span>
              {item.cancelled ? <span className='px-2 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium'>Cancelled</span> : item.isCompleted ? <span className='px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium'>Completed</span> : <div className='flex gap-1'><button onClick={() => handleCancel(item._id)} disabled={!!actioningId} className='p-2 rounded-lg hover:bg-red-50 disabled:opacity-70 disabled:cursor-not-allowed' title="Cancel"><img className='w-6' src={assets.cancel_icon} alt="Cancel" /></button><button onClick={() => handleComplete(item._id)} disabled={!!actioningId} className='p-2 rounded-lg hover:bg-emerald-50 disabled:opacity-70 disabled:cursor-not-allowed' title="Complete"><img className='w-6' src={assets.tick_icon} alt="Complete" /></button></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments