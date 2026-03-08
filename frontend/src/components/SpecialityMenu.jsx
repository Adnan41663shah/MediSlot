import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <section id='speciality' className='py-10 sm:py-12 md:py-16 lg:py-20'>
            <div className='text-center mb-8 md:mb-12'>
                <h2 className='text-2xl md:text-4xl font-bold text-text-primary'>Choose Your Specialist</h2>
                <p className='mt-2 md:mt-3 text-text-secondary max-w-2xl mx-auto text-sm md:text-base px-2'>Whether you need a routine checkup, specialist consultation, or preventive care—our board-certified doctors are here to help. Select a category below to browse available physicians.</p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6'>
                {specialityData.map((item, index) => (
                    <Link to={`/doctors/${item.speciality}`} onClick={() => scrollTo(0, 0)}
                        className='card flex flex-col items-center p-4 sm:p-6 hover:-translate-y-1 hover:border-primary/30 group' key={index}>
                        <div className='w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary-muted flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-primary/20 transition-colors flex-shrink-0'>
                            <img className='w-7 h-7 sm:w-10 sm:h-10 object-contain' src={item.image} alt={item.speciality} />
                        </div>
                        <span className='text-xs sm:text-sm font-medium text-text-secondary group-hover:text-primary transition-colors text-center leading-tight'>{item.speciality}</span>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default SpecialityMenu