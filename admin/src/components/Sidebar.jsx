import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'

const Sidebar = ({ isOpen = false, onClose }) => {
  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const linkClass = ({ isActive }) => `flex items-center gap-3 py-3 px-4 md:px-6 rounded-r-xl transition-colors ${isActive ? 'bg-primary-muted text-primary font-medium border-l-4 border-primary' : 'text-text-secondary hover:bg-stone-50 hover:text-primary'}`

  const navContent = (
    <>
      {aToken && (
        <ul className='pt-4 space-y-1'>
          <li><NavLink to='/admin-dashboard' onClick={onClose} className={linkClass}><img className='w-5 shrink-0' src={assets.home_icon} alt='' /><span>Dashboard</span></NavLink></li>
          <li><NavLink to='/all-appointments' onClick={onClose} className={linkClass}><img className='w-5 shrink-0' src={assets.appointment_icon} alt='' /><span>Appointments</span></NavLink></li>
          <li><NavLink to='/add-doctor' onClick={onClose} className={linkClass}><img className='w-5 shrink-0' src={assets.add_icon} alt='' /><span>Add Doctor</span></NavLink></li>
          <li><NavLink to='/doctor-list' onClick={onClose} className={linkClass}><img className='w-5 shrink-0' src={assets.people_icon} alt='' /><span>Doctors List</span></NavLink></li>
        </ul>
      )}
      {dToken && (
        <ul className='pt-4 space-y-1'>
          <li><NavLink to='/doctor-dashboard' onClick={onClose} className={linkClass}><img className='w-5 shrink-0' src={assets.home_icon} alt='' /><span>Dashboard</span></NavLink></li>
          <li><NavLink to='/doctor-appointments' onClick={onClose} className={linkClass}><img className='w-5 shrink-0' src={assets.appointment_icon} alt='' /><span>Appointments</span></NavLink></li>
          <li><NavLink to='/doctor-profile' onClick={onClose} className={linkClass}><img className='w-5 shrink-0' src={assets.people_icon} alt='' /><span>Profile</span></NavLink></li>
        </ul>
      )}
    </>
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black/40 z-40'
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* Sidebar - drawer on mobile, static on desktop */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 min-h-screen bg-white border-r border-stone-100 flex-shrink-0
          transform md:transform-none transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className='flex items-center justify-between p-4 border-b border-stone-100 md:hidden'>
          <span className='font-semibold text-text-primary'>Menu</span>
          <button onClick={onClose} className='p-2 rounded-lg hover:bg-stone-100' aria-label='Close menu'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
          </button>
        </div>
        {navContent}
      </aside>
    </>
  )
}

export default Sidebar
