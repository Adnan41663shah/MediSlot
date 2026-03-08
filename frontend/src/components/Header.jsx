import React from 'react'
import { assets } from '../assets/assets'

const patternSvg = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"

const Header = () => {
    return (
        <div className='relative flex flex-col md:flex-row overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark shadow-soft'>
            <div className='absolute inset-0 opacity-50' style={{ backgroundImage: `url("${patternSvg}")` }} />
            <div className='md:w-1/2 flex flex-col justify-center gap-6 py-10 sm:py-12 md:py-16 lg:py-20 px-5 sm:px-6 md:px-10 lg:px-14 relative z-10'>
                <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.15] tracking-tight'>
                    Healthcare Made Simple. Book in Minutes.
                </h1>
                <p className='text-white/90 text-base md:text-lg max-w-md font-medium'>
                    Skip the wait. Find verified doctors across 6 specialties, pick a time that fits your schedule, and get the care you deserve—without the hassle of phone calls.
                </p>
                <div className='flex flex-col sm:flex-row items-start gap-4'>
                    <a href='#speciality' className='inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl shadow-card hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300'>
                        Explore Specialties <img className='w-4' src={assets.arrow_icon} alt="" />
                    </a>
                    <span className='flex items-center gap-2 text-white/80 text-sm'>
                        <img className='w-24 rounded-full' src={assets.group_profiles} alt="" />
                        Trusted by 25,000+ patients across India
                    </span>
                </div>
            </div>
            <div className='md:w-1/2 relative flex items-end justify-center md:justify-end pt-8 md:pt-0'>
                <img
                    src="/doctors.webp"
                    alt="Healthcare professionals"
                    className="w-full max-w-md sm:max-w-lg md:max-w-none md:w-[90%] lg:w-[85%] h-auto object-contain object-bottom"
                    loading="eager"
                    decoding="async"
                />
            </div>
        </div>
    )
}

export default Header