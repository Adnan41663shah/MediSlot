import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

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
  }, [dToken, getAppointments])

  return (
    <div className='w-full max-w-6xl p-4 sm:p-6 lg:p-8'>
      <h1 className='text-xl sm:text-2xl font-bold text-text-primary mb-4 sm:mb-6'>Appointments</h1>
      <div className='card overflow-hidden'>
        <div className='overflow-x-auto max-h-[75vh] overflow-y-auto'>
          <table className='w-full min-w-[700px] border-collapse'>
            <thead className='sticky top-0 bg-stone-50 z-10'>
              <tr>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider w-12'>sr. no</th>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider'>Patient</th>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider'>Payment</th>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider'>Age</th>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider'>Date & Time</th>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider'>Fees</th>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider'>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item, index) => (
                <tr key={item._id} className='border-t border-stone-100 hover:bg-stone-50/50 transition-colors'>
                  <td className='py-4 px-4 text-text-secondary text-sm'>{index + 1}</td>
                  <td className='py-4 px-4'>
                    <div className='flex items-center gap-2'>
                      <img src={item.userData?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userData?.name || 'P')}&background=0D9488&color=fff`} className='w-9 h-9 rounded-lg object-cover bg-primary-muted' alt="" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userData?.name || 'P')}&background=0D9488&color=fff` }} />
                      <span className='font-medium text-text-primary text-sm'>{item.userData?.name}</span>
                    </div>
                  </td>
                  <td className='py-4 px-4'>
                    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium ${item.payment ? 'bg-primary-muted text-primary' : 'bg-stone-100 text-text-muted'}`}>
                      {item.payment ? 'Online' : 'Cash'}
                    </span>
                  </td>
                  <td className='py-4 px-4 text-text-secondary text-sm'>{calculateAge(item.userData?.dob)}</td>
                  <td className='py-4 px-4 text-text-secondary text-sm'>{slotDateFormat(item.slotDate)}, {item.slotTime}</td>
                  <td className='py-4 px-4 text-text-secondary text-sm font-medium'>{currency}{item.amount}</td>
                  <td className='py-4 px-4'>
                    {item.cancelled ? (
                      <span className='inline-block px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium'>Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className='inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium'>Completed</span>
                    ) : (
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => handleComplete(item._id)} disabled={!!actioningId} className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'>
                          <svg className='w-4 h-4 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>
                          {actioningId === item._id ? '...' : 'Complete'}
                        </button>
                        <button onClick={() => handleCancel(item._id)} disabled={!!actioningId} className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'>
                          <svg className='w-4 h-4 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
                          {actioningId === item._id ? '...' : 'Cancel'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments
