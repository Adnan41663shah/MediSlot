import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Banner = () => {
    const navigate = useNavigate()
    const { token } = useContext(AppContext)

    const handleClick = () => {
        if (token) {
            navigate('/doctors')
        } else {
            navigate('/login')
        }
        scrollTo(0, 0)
    }

    return (
        <div className='flex flex-col md:flex-row overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark shadow-soft my-10 sm:my-14 md:my-20 lg:my-24'>
            <div className='flex-1 py-10 sm:py-12 md:py-16 lg:py-20 px-5 sm:px-6 md:px-10 lg:px-14 flex flex-col justify-center'>
                <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight'>
                    Start Your Healthcare Journey Today
                </h2>
                <p className='text-white/90 mt-3 text-base md:text-lg max-w-lg'>
                    Create a free account to book appointments, track your visit history, and receive smart reminders. No credit card required—join over 25,000 patients who've simplified their healthcare.
                </p>
                <button onClick={handleClick} className='btn-primary mt-8 bg-white text-primary hover:bg-white/95 w-fit'>
                    {token ? 'Book Appointment' : 'Create Free Account'}
                </button>
            </div>
            <div className='hidden md:block md:w-2/5 lg:w-[400px] flex items-end justify-end'>
                <img className='w-full max-w-sm object-contain object-bottom' src={assets.appointment_img} alt="" />
            </div>
        </div>
    )
}

export default Banner