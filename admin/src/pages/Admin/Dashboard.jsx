import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='p-4 sm:p-6 lg:p-8'>
      <h1 className='text-xl sm:text-2xl font-bold text-text-primary mb-4 sm:mb-6'>Dashboard</h1>
      <div className='grid sm:grid-cols-3 gap-4 mb-10'>
        <div className='card p-6 flex items-center gap-4 hover:shadow-soft transition-shadow'>
          <div className='w-14 h-14 rounded-2xl bg-primary-muted flex items-center justify-center'><img className='w-8' src={assets.doctor_icon} alt="" /></div>
          <div>
            <p className='text-2xl font-bold text-text-primary'>{dashData.doctors}</p>
            <p className='text-text-muted text-sm'>Doctors</p>
          </div>
        </div>
        <div className='card p-6 flex items-center gap-4 hover:shadow-soft transition-shadow'>
          <div className='w-14 h-14 rounded-2xl bg-primary-muted flex items-center justify-center'><img className='w-8' src={assets.appointments_icon} alt="" /></div>
          <div>
            <p className='text-2xl font-bold text-text-primary'>{dashData.appointments}</p>
            <p className='text-text-muted text-sm'>Appointments</p>
          </div>
        </div>
        <div className='card p-6 flex items-center gap-4 hover:shadow-soft transition-shadow'>
          <div className='w-14 h-14 rounded-2xl bg-primary-muted flex items-center justify-center'><img className='w-8' src={assets.patients_icon} alt="" /></div>
          <div>
            <p className='text-2xl font-bold text-text-primary'>{dashData.patients}</p>
            <p className='text-text-muted text-sm'>Patients</p>
          </div>
        </div>
      </div>

      <div className='card overflow-hidden'>
        <div className='flex items-center gap-3 px-6 py-4 border-b border-stone-100'>
          <img src={assets.list_icon} alt="" className='w-5' />
          <h2 className='font-semibold text-text-primary'>Latest Bookings</h2>
        </div>
        <div className='divide-y divide-stone-100'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-4 gap-4 hover:bg-stone-50/50' key={index}>
              <img className='rounded-xl w-12 h-12 object-cover' src={item.docData.image} alt="" />
              <div className='flex-1'>
                <p className='font-medium text-text-primary'>{item.docData.name}</p>
                <p className='text-text-muted text-sm'>{slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled ? <span className='px-3 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium'>Cancelled</span> : item.isCompleted ? <span className='px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium'>Completed</span> : <button onClick={() => cancelAppointment(item._id)} className='p-2 rounded-lg hover:bg-red-50'><img className='w-6' src={assets.cancel_icon} alt="Cancel" /></button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard