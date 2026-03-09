import React, { useContext, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [menuClosing, setMenuClosing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden'
      setMenuClosing(false)
      requestAnimationFrame(() => requestAnimationFrame(() => setMenuOpen(true)))
    } else {
      setMenuOpen(false)
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showMenu])

  const closeMenu = () => {
    setMenuClosing(true)
    setTimeout(() => {
      setShowMenu(false)
      setMenuClosing(false)
    }, 280)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    closeMenu()
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
        <li><NavLink to='/doctors' className='btn-primary text-sm py-2 px-4'>Book Appointment</NavLink></li>
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

      {/* Mobile Menu - Rendered via portal with smooth open/close transitions */}
      {showMenu && createPortal(
        <div className='md:hidden fixed inset-0 z-[9999] flex pointer-events-auto' role="dialog" aria-modal="true" aria-label="Navigation menu">
          {/* Backdrop - fades in/out */}
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${menuOpen && !menuClosing ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeMenu}
            aria-hidden="true"
          />
          {/* Menu panel - slides in from right */}
          <div
            className={`relative ml-auto w-full max-w-[min(320px,85vw)] sm:max-w-sm bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${menuOpen && !menuClosing ? 'translate-x-0' : 'translate-x-full'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-between items-center p-4 sm:p-5 border-b border-stone-200 shrink-0'>
              <img src="/medislot.png" className='h-20 sm:h-9 w-auto max-w-[180px] sm:max-w-[220px] object-contain' alt="MediSlot" />
              <button
                onClick={closeMenu}
                className='p-2.5 -mr-2 rounded-xl hover:bg-stone-100 active:bg-stone-200 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center'
                aria-label="Close menu"
              >
                <img src={assets.cross_icon} className='w-6 h-6' alt="" />
              </button>
            </div>
            <nav className='flex flex-col gap-0.5 p-4 sm:p-5 flex-1 overflow-y-auto'>
              <NavLink onClick={closeMenu} to='/doctors' className='btn-primary text-center py-3 px-4 rounded-xl font-semibold mb-3 text-sm sm:text-base'>Book Appointment</NavLink>
              <NavLink onClick={closeMenu} to='/' className='block py-3.5 sm:py-4 px-4 rounded-xl font-medium text-text-primary hover:bg-stone-50 active:bg-stone-100 transition-colors text-[15px]'>Home</NavLink>
              <NavLink onClick={closeMenu} to='/doctors' className='block py-3.5 sm:py-4 px-4 rounded-xl font-medium text-text-primary hover:bg-stone-50 active:bg-stone-100 transition-colors text-[15px]'>All Doctors</NavLink>
              <NavLink onClick={closeMenu} to='/about' className='block py-3.5 sm:py-4 px-4 rounded-xl font-medium text-text-primary hover:bg-stone-50 active:bg-stone-100 transition-colors text-[15px]'>About</NavLink>
              <NavLink onClick={closeMenu} to='/contact' className='block py-3.5 sm:py-4 px-4 rounded-xl font-medium text-text-primary hover:bg-stone-50 active:bg-stone-100 transition-colors text-[15px]'>Contact</NavLink>
              {token && userData ? (
                <>
                  <div className='border-t border-stone-100 my-2' />
                  <NavLink onClick={closeMenu} to='/my-profile' className='block py-3.5 sm:py-4 px-4 rounded-xl font-medium text-text-primary hover:bg-stone-50 active:bg-stone-100 transition-colors text-[15px]'>My Profile</NavLink>
                  <NavLink onClick={closeMenu} to='/my-appointments' className='block py-3.5 sm:py-4 px-4 rounded-xl font-medium text-text-primary hover:bg-stone-50 active:bg-stone-100 transition-colors text-[15px]'>My Appointments</NavLink>
                  <button onClick={logout} className='block w-full text-left py-3.5 sm:py-4 px-4 rounded-xl font-medium text-red-600 hover:bg-red-50 active:bg-red-50 transition-colors text-[15px]'>Logout</button>
                </>
              ) : (
                <NavLink onClick={closeMenu} to='/login' className='block py-3.5 px-4 rounded-xl font-semibold text-primary bg-primary-muted mt-4 text-center hover:bg-primary-muted/80 active:bg-primary-muted/90 transition-colors text-[15px]'>Create Account / Login</NavLink>
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
