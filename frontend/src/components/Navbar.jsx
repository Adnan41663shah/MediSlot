import React, { useContext, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  useEffect(() => {
    if (showMenu) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [showMenu])

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    setShowMenu(false)
    navigate('/login')
  }

  return (
    <nav className='flex items-center justify-between py-3 sm:py-4 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 px-4 sm:px-6 md:px-8 lg:px-10 border-b border-stone-200/80 bg-surface-warm/80 backdrop-blur-sm sticky top-0 z-[100]'>
      <div className="flex items-center overflow-hidden cursor-pointer h-12 sm:h-14 md:h-16" onClick={() => navigate('/')}>
        <img src="/medislot.png" alt="MediSlot" className="h-[130px] absolute left-0 w-auto object-contain" />
      </div>

      <ul className='hidden md:flex items-center gap-8 font-medium text-text-secondary'>
        <li><NavLink to='/' className={({ isActive }) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'hover:text-primary'}`}>Home</NavLink></li>
        <li><NavLink to='/doctors' className={({ isActive }) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'hover:text-primary'}`}>All Doctors</NavLink></li>
        <li><NavLink to='/about' className={({ isActive }) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'hover:text-primary'}`}>About</NavLink></li>
        <li><NavLink to='/contact' className={({ isActive }) => `transition-colors ${isActive ? 'text-primary font-semibold' : 'hover:text-primary'}`}>Contact</NavLink></li>
      </ul>

      <div className='flex items-center gap-3'>

        {token && userData ? (
          <div className='flex items-center gap-2 sm:gap-3 cursor-pointer group relative'>
            <span className='hidden md:inline text-sm font-medium text-text-secondary'>Welcome {userData.name}.</span>
            <img
              className='w-11 h-11 rounded-full object-cover ring-2 ring-primary/20 bg-primary-muted'
              src={userData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=0D9488&color=fff`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=0D9488&color=fff`
              }}
              alt="profile"
            />
            <div className='absolute top-full right-0 pt-2 hidden group-hover:block'>
              <div className='min-w-48 bg-white rounded-xl shadow-card border border-stone-100 flex flex-col gap-1 py-2'>
                <p onClick={() => navigate('my-profile')} className='px-4 py-2 text-sm text-text-secondary hover:bg-primary-muted hover:text-primary cursor-pointer transition-colors'>My Profile</p>
                <p onClick={() => navigate('my-appointments')} className='px-4 py-2 text-sm text-text-secondary hover:bg-primary-muted hover:text-primary cursor-pointer transition-colors'>My Appointments</p>
                <p onClick={logout} className='px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors'>Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <NavLink to='/login' className='btn-primary hidden md:inline-flex text-sm'>
            Create Account
          </NavLink>
        )}

        <button onClick={() => setShowMenu(true)} className='w-10 h-10 md:hidden flex items-center justify-center rounded-xl hover:bg-stone-100'>
          <img className='w-5' src={assets.menu_icon} alt="Menu" />
        </button>
      </div>

      {/* Mobile Menu - Rendered via portal so it always stacks above page content */}
      {showMenu && createPortal(
        <div className='md:hidden fixed inset-0 z-[9999] flex' role="dialog" aria-modal="true" aria-label="Navigation menu">
          {/* Backdrop - blocks interaction with content behind */}
          <div
            className='absolute inset-0 bg-black/30'
            onClick={() => setShowMenu(false)}
            aria-hidden="true"
          />
          {/* Menu panel - solid white, slides in from right */}
          <div
            className='relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-between items-center p-5 border-b border-stone-200 shrink-0'>
              <img src="/medislot.png" className='h-30 w-auto max-w-[260px] object-contain' alt="MediSlot" />
              <button
                onClick={() => setShowMenu(false)}
                className='p-2.5 -mr-2 rounded-xl hover:bg-stone-100 active:bg-stone-200'
                aria-label="Close menu"
              >
                <img src={assets.cross_icon} className='w-6 h-6' alt="" />
              </button>
            </div>
            <nav className='flex flex-col gap-1 p-5 flex-1 overflow-y-auto'>
              <NavLink onClick={() => setShowMenu(false)} to='/' className='block py-4 px-4 rounded-xl font-medium text-text-primary hover:bg-primary-muted active:bg-primary-muted'>Home</NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/doctors' className='block py-4 px-4 rounded-xl font-medium text-text-primary hover:bg-primary-muted active:bg-primary-muted'>All Doctors</NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/about' className='block py-4 px-4 rounded-xl font-medium text-text-primary hover:bg-primary-muted active:bg-primary-muted'>About</NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/contact' className='block py-4 px-4 rounded-xl font-medium text-text-primary hover:bg-primary-muted active:bg-primary-muted'>Contact</NavLink>
              {token && userData ? (
                <>
                  <NavLink onClick={() => setShowMenu(false)} to='/my-profile' className='block py-4 px-4 rounded-xl font-medium text-text-primary hover:bg-primary-muted active:bg-primary-muted'>My Profile</NavLink>
                  <NavLink onClick={() => setShowMenu(false)} to='/my-appointments' className='block py-4 px-4 rounded-xl font-medium text-text-primary hover:bg-primary-muted active:bg-primary-muted'>My Appointments</NavLink>
                  <button onClick={logout} className='block w-full text-left py-4 px-4 rounded-xl font-medium text-red-600 hover:bg-red-50 active:bg-red-50'>Logout</button>
                </>
              ) : (
                <NavLink onClick={() => setShowMenu(false)} to='/login' className='block py-4 px-4 rounded-xl font-semibold text-primary bg-primary-muted mt-6 text-center'>Create Account / Login</NavLink>
              )}
            </nav>
          </div>
        </div>,
        document.body
      )}
    </nav>
  )
}

export default Navbar
