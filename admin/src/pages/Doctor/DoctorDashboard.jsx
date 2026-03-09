import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorDashboard = () => {
  const [actioningId, setActioningId] = useState(null)
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)

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
      getDashData()
    }

  }, [dToken, getDashData])

  return dashData && (
    <div className='p-4 sm:p-6 lg:p-8'>
      <h1 className='text-xl sm:text-2xl font-bold text-text-primary mb-4 sm:mb-6'>Dashboard</h1>
      <div className='grid sm:grid-cols-3 gap-4 mb-10'>
        <div className='card p-6 flex items-center gap-4'><div className='w-14 h-14 rounded-2xl bg-primary-muted flex items-center justify-center'><img className='w-8' src={assets.earning_icon} alt="" /></div><div><p className='text-2xl font-bold text-text-primary'>{currency}{dashData.earnings}</p><p className='text-text-muted text-sm'>Earnings</p></div></div>
        <div className='card p-6 flex items-center gap-4'><div className='w-14 h-14 rounded-2xl bg-primary-muted flex items-center justify-center'><img className='w-8' src={assets.appointments_icon} alt="" /></div><div><p className='text-2xl font-bold text-text-primary'>{dashData.appointments}</p><p className='text-text-muted text-sm'>Appointments</p></div></div>
        <div className='card p-6 flex items-center gap-4'><div className='w-14 h-14 rounded-2xl bg-primary-muted flex items-center justify-center'><img className='w-8' src={assets.patients_icon} alt="" /></div><div><p className='text-2xl font-bold text-text-primary'>{dashData.patients}</p><p className='text-text-muted text-sm'>Patients</p></div></div>
      </div>
      <div className='card overflow-hidden'>
        <div className='flex items-center gap-3 px-6 py-4 border-b border-stone-100'>
          <img src={assets.list_icon} alt="" className='w-5' />
          <h2 className='font-semibold text-text-primary'>Latest Appointments</h2>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='border-b border-stone-100'>
                <th className='text-left py-3 px-6 text-text-muted text-xs font-semibold uppercase tracking-wider'>Patient</th>
                <th className='text-left py-3 px-6 text-text-muted text-xs font-semibold uppercase tracking-wider'>Date</th>
                <th className='text-left py-3 px-6 text-text-muted text-xs font-semibold uppercase tracking-wider'>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashData.latestAppointments.slice(0, 5).map((item) => (
                <tr key={item._id} className='border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors'>
                  <td className='py-4 px-6'>
                    <div className='flex items-center gap-3'>
                      <img className='rounded-xl w-12 h-12 object-cover bg-primary-muted' src={item.userData?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userData?.name || 'P')}&background=0D9488&color=fff`} alt="" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userData?.name || 'P')}&background=0D9488&color=fff` }} />
                      <span className='font-medium text-text-primary text-sm'>{item.userData?.name}</span>
                    </div>
                  </td>
                  <td className='py-4 px-6 text-text-secondary text-sm'>{slotDateFormat(item.slotDate)}</td>
                  <td className='py-4 px-6'>
                    {item.cancelled ? (
                      <span className='inline-block px-3 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium'>Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className='inline-block px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium'>Completed</span>
                    ) : (
                      <div className='flex flex-wrap gap-2'>
                        <button onClick={() => handleComplete(item._id)} disabled={!!actioningId} className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>
                          {actioningId === item._id ? '...' : 'Complete'}
                        </button>
                        <button onClick={() => handleCancel(item._id)} disabled={!!actioningId} className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
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

export default DoctorDashboard