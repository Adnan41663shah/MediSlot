import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {
  const [actioningId, setActioningId] = useState(null)
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  const handleCancel = async (id) => {
    if (actioningId) return
    setActioningId(id)
    try {
      await cancelAppointment(id)
    } finally {
      setActioningId(null)
    }
  }

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken, getDashData])

  const statCards = [
    { label: 'Doctors', value: dashData?.doctors ?? 0, icon: assets.doctor_icon, color: 'from-teal-500/10 to-teal-500/5', iconBg: 'bg-teal-500/15', iconColor: 'text-teal-600' },
    { label: 'Appointments', value: dashData?.appointments ?? 0, icon: assets.appointments_icon, color: 'from-primary/10 to-primary/5', iconBg: 'bg-primary/15', iconColor: 'text-primary' },
    { label: 'Patients', value: dashData?.patients ?? 0, icon: assets.patients_icon, color: 'from-emerald-500/10 to-emerald-500/5', iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-600' },
  ]

  const latestAppointments = dashData?.latestAppointments?.slice(0, 5) ?? []

  return dashData && (
    <div className='p-4 sm:p-6 lg:p-8 max-w-6xl'>
      <div className='mb-6 sm:mb-8'>
        <h1 className='text-2xl sm:text-3xl font-bold text-text-primary tracking-tight'>Dashboard</h1>
        <p className='text-text-muted text-sm sm:text-base mt-1'>Overview of your clinic and recent appointments</p>
      </div>

      {/* Stat cards - responsive grid */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10'>
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`card p-5 sm:p-6 flex items-center gap-4 bg-gradient-to-br ${card.color} border-stone-100/80 hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5`}
          >
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
              <img className='w-6 h-6 sm:w-8 sm:h-8' src={card.icon} alt="" />
            </div>
            <div className='min-w-0'>
              <p className='text-2xl sm:text-3xl font-bold text-text-primary tabular-nums'>{card.value}</p>
              <p className='text-text-muted text-sm font-medium'>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Appointments */}
      <div className='card overflow-hidden'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-stone-100'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-primary-muted flex items-center justify-center'>
              <img src={assets.list_icon} alt="" className='w-5 h-5' />
            </div>
            <div>
              <h2 className='font-semibold text-text-primary text-lg'>Latest Appointments</h2>
              <p className='text-text-muted text-xs sm:text-sm'>Recent booking activity</p>
            </div>
          </div>
          <Link to='/all-appointments' className='text-sm font-medium text-primary hover:text-primary-dark transition-colors'>View all →</Link>
        </div>

        {latestAppointments.length === 0 ? (
          <div className='p-12 text-center'>
            <p className='text-5xl mb-3 opacity-40'>📅</p>
            <p className='text-text-muted text-sm'>No appointments yet</p>
          </div>
        ) : (
          <>
            {/* Mobile: Card layout */}
            <div className='md:hidden divide-y divide-stone-100'>
              {latestAppointments.map((item) => (
                <div key={item._id} className='p-4 flex items-center gap-3'>
                  <img className='w-12 h-12 rounded-xl object-cover bg-primary-muted flex-shrink-0' src={item.docData?.image} alt="" />
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-text-primary text-sm truncate'>{item.docData?.name}</p>
                    <p className='text-text-muted text-xs'>{slotDateFormat(item.slotDate)}</p>
                  </div>
                  <div className='flex-shrink-0'>
                    {item.cancelled ? (
                      <span className='inline-block px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium'>Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className='inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium'>Completed</span>
                    ) : (
                      <button onClick={() => handleCancel(item._id)} disabled={!!actioningId} className='p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-70' title="Cancel">
                        <img className='w-5 h-5' src={assets.cancel_icon} alt="Cancel" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table layout */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full border-collapse'>
                <thead>
                  <tr className='border-b border-stone-100 bg-stone-50/50'>
                    <th className='text-left py-3.5 px-6 text-text-muted text-xs font-semibold uppercase tracking-wider'>Doctor</th>
                    <th className='text-left py-3.5 px-6 text-text-muted text-xs font-semibold uppercase tracking-wider'>Date</th>
                    <th className='text-left py-3.5 px-6 text-text-muted text-xs font-semibold uppercase tracking-wider'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestAppointments.map((item) => (
                    <tr key={item._id} className='border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors'>
                      <td className='py-4 px-6'>
                        <div className='flex items-center gap-3'>
                          <img className='rounded-xl w-11 h-11 object-cover bg-primary-muted flex-shrink-0' src={item.docData?.image} alt="" />
                          <span className='font-medium text-text-primary text-sm'>{item.docData?.name}</span>
                        </div>
                      </td>
                      <td className='py-4 px-6 text-text-secondary text-sm'>{slotDateFormat(item.slotDate)}</td>
                      <td className='py-4 px-6'>
                        {item.cancelled ? (
                          <span className='inline-block px-3 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium'>Cancelled</span>
                        ) : item.isCompleted ? (
                          <span className='inline-block px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium'>Completed</span>
                        ) : (
                          <button onClick={() => handleCancel(item._id)} disabled={!!actioningId} className='p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed' title="Cancel">
                            <img className='w-5 h-5' src={assets.cancel_icon} alt="Cancel" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
