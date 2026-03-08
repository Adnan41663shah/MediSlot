import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import WhyChooseUs from '../components/WhyChooseUs'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div className='space-y-12 md:space-y-16'>
      <Header />
      <SpecialityMenu />
      <WhyChooseUs />
      <TopDoctors />
      <Banner />
    </div>
  )
}

export default Home