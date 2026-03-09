import React, { useContext } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = ({ onMenuClick }) => {
  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)
  const navigate = useNavigate()
  const location = useLocation()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  const userPanelUrl = import.meta.env.DEV ? 'http://localhost:5173' : 'https://medislot-tau.vercel.app/'

  const isOnDashboard =
    location.pathname === '/admin-dashboard' ||
    location.pathname === '/doctor-dashboard'

  return (
    <nav className='flex justify-between items-center px-4 sm:px-6 md:px-10 py-0 border-b border-stone-200 bg-white'>
      <div className='flex items-center gap-2 sm:gap-3'>
        <button onClick={onMenuClick} className='md:hidden p-2 -ml-2 rounded-lg hover:bg-stone-100' aria-label='Open menu'>
          <svg className='w-6 h-6 text-text-secondary' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' /></svg>
        </button>
        <img onClick={() => navigate('/')} className='h-18 sm:h-20 w-auto max-w-[140px] cursor-pointer object-contain' src="/medislot.png" alt="MediSlot Admin" />
        <span className='px-3 py-1 rounded-lg bg-primary-muted text-primary text-sm font-medium'>{aToken ? 'Admin' : 'Doctor'}</span>
        {isOnDashboard && (
          <a href={userPanelUrl} target="_blank" rel="noopener noreferrer"
            className='hidden sm:inline text-sm font-medium text-primary hover:text-primary-dark transition-colors'>
            User Panel
          </a>
        )}
      </div>
      <button onClick={logout} className='px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-stone-100 text-text-secondary text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors'>
        Logout
      </button>
    </nav>
  )
}

export default Navbar
