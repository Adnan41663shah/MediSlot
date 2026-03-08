import React from 'react'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'Doctor Directory' },
    { to: '/about', label: 'About MediSlot' },
    { to: '/contact', label: 'Contact Us' },
  ]

  return (
    <footer className="mt-16 sm:mt-20 md:mt-24 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 overflow-hidden">
      {/* Main footer - dark teal gradient */}
      <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-dark text-white">
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-12 sm:py-14 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-5 flex flex-col gap-5">
           
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">MediSlot</h3>
                <p className="text-white/80 text-sm sm:text-base mt-1 max-w-sm leading-relaxed">
                  India's trusted healthcare scheduling platform. Book verified doctors, manage appointments, and receive smart reminders—all from your phone or desktop.
                </p>
              </div>
              <a
                href="mailto:customersupport@medislot.in"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors w-fit"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                customersupport@medislot.in
              </a>
            </div>

            {/* Quick links */}
            <div className="sm:col-span-1 lg:col-span-2" />
            <div className="lg:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-4">Quick Links</h4>
              <ul className="flex flex-col gap-3">
                {quickLinks.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `text-sm font-medium transition-colors hover:text-white ${isActive ? 'text-white' : 'text-white/80'}`
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-4">Get in Touch</h4>
              <ul className="flex flex-col gap-4 text-sm">
                <li>
                  <a
                    href="tel:+919000090000"
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                  >
                    <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </span>
                    +91 95292 57473
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:customersupport@medislot.in"
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                  >
                    <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </span>
                    customersupport@medislot.in
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-stone-900 text-stone-400 px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} MediSlot. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">Privacy Policy</span>
            <span className="hidden sm:inline">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
