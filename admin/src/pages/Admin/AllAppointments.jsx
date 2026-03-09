import React, { useState } from 'react'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {
  const [actioningId, setActioningId] = useState(null)
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

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
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl p-4 sm:p-6 lg:p-8'>
      <h1 className='text-xl sm:text-2xl font-bold text-text-primary mb-4 sm:mb-6'>All Appointments</h1>
      <div className='card overflow-hidden'>
        <div className='overflow-x-auto max-h-[75vh] overflow-y-auto'>
          <table className='w-full min-w-[800px] border-collapse'>
            <thead className='sticky top-0 bg-stone-50 z-10'>
              <tr>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider w-12'>#</th>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider'>Patient</th>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider'>Age</th>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider'>Date & Time</th>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider'>Doctor</th>
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
                      <img src={item.userData?.image} className='w-9 h-9 rounded-lg object-cover bg-primary-muted' alt="" />
                      <span className='font-medium text-text-primary text-sm'>{item.userData?.name}</span>
                    </div>
                  </td>
                  <td className='py-4 px-4 text-text-secondary text-sm'>{calculateAge(item.userData?.dob)}</td>
                  <td className='py-4 px-4 text-text-secondary text-sm'>{slotDateFormat(item.slotDate)} {item.slotTime}</td>
                  <td className='py-4 px-4'>
                    <div className='flex items-center gap-2'>
                      <img src={item.docData?.image} className='w-9 h-9 rounded-lg object-cover bg-primary-muted' alt="" />
                      <span className='text-text-secondary text-sm'>{item.docData?.name}</span>
                    </div>
                  </td>
                  <td className='py-4 px-4 text-text-secondary text-sm font-medium'>{currency}{item.amount}</td>
                  <td className='py-4 px-4'>
                    {item.cancelled ? (
                      <span className='inline-block px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium'>Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className='inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium'>Completed</span>
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
      </div>
    </div>
  )
}

export default AllAppointments
