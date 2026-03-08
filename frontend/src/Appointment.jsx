import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getErrorMessage } from './utils/toastMessages.js'
import { AppContext } from './context/AppContext'
import { assets } from './assets/assets'
import RelatedDoctors from './components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    const doc = doctors.find((doc) => doc._id === docId)
    if (doc) {
      // Ensure slots_booked is always at least an empty object
      setDocInfo({ ...doc, slots_booked: doc.slots_booked || {} })
    }
  }

  const getAvailableSlots = () => {
    if (!docInfo) return
    setDocSlots([])

    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      const endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      const timeSlots = []

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })

        const day = currentDate.getDate()
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const slotDate = `${day}_${month}_${year}`
        const slotTime = formattedTime

        const isSlotAvailable =
          !docInfo?.slots_booked?.[slotDate] ||
          !docInfo.slots_booked[slotDate].includes(slotTime)

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots((prev) => [...prev, timeSlots])
    }
  }

  const bookAppointment = async () => {

    if (!token) {
      toast.warning('Please sign in to book an appointment')
      return navigate('/login')
    }

    const date = docSlots[slotIndex][0].datetime
  
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    const slotDate = day + "_" + month + "_" + year

    try {

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message || 'Could not book appointment.')
      }

    } catch (error) {
      console.log(error)
      toast.error(getErrorMessage(error))
    }

  }

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo()
    }
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
    }
  }, [docInfo])

  return (
    docInfo && (
      <div className='py-6 sm:py-8'>
        <div className='flex flex-col lg:flex-row gap-6 sm:gap-8'>
          <div className='lg:w-80 flex-shrink-0'>
            <img className='w-full aspect-square object-cover rounded-2xl shadow-soft' src={docInfo.image} alt={docInfo.name} />
          </div>
          <div className='flex-1 card p-6 sm:p-8'>
            <div className='flex items-start gap-3'>
              <h1 className='text-2xl md:text-3xl font-bold text-text-primary'>{docInfo.name}</h1>
              <img src={assets.verified_icon} alt="Verified" className='w-6 h-6' />
            </div>
            <div className='flex flex-wrap items-center gap-2 mt-2'>
              <span className='text-text-secondary'>{docInfo.degree} — {docInfo.speciality}</span>
              <span className='px-2.5 py-0.5 rounded-lg bg-primary-muted text-primary text-xs font-medium'>{docInfo.experience}</span>
            </div>
            <div className='mt-6'>
              <h3 className='flex items-center gap-2 font-semibold text-text-primary'>
                About <img src={assets.info_icon} alt="" className='w-4' />
              </h3>
              <p className='text-text-secondary mt-1 leading-relaxed'>{docInfo.about}</p>
            </div>
            <p className='text-text-secondary mt-6'>
              Appointment fee: <span className='font-semibold text-text-primary'>{currencySymbol}{docInfo.fees}</span>
            </p>
          </div>
        </div>

        <div className='mt-8 sm:mt-10 card p-6 sm:p-8'>
          <h3 className='font-semibold text-text-primary mb-4'>Select Date & Time</h3>
          <div className='flex gap-2 overflow-x-auto pb-2'>
            {docSlots.length > 0 && docSlots.map((item, index) => (
              <button onClick={() => setSlotIndex(index)} key={index}
                className={`flex-shrink-0 text-center py-4 px-5 rounded-xl min-w-[72px] font-medium transition-all ${slotIndex === index ? 'bg-primary text-white shadow-soft' : 'border border-stone-200 hover:border-primary/50 text-text-secondary'}`}>
                <span className='block text-xs opacity-90'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</span>
                <span className='block text-lg'>{item[0] && item[0].datetime.getDate()}</span>
              </button>
            ))}
          </div>
          <div className='flex flex-wrap gap-2 mt-4'>
            {docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].map((item, index) => (
              <button onClick={() => setSlotTime(item.time)} key={index}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${item.time === slotTime ? 'bg-primary text-white' : 'border border-stone-200 text-text-secondary hover:border-primary/50'}`}>
                {item.time.toLowerCase()}
              </button>
            ))}
          </div>
          <button onClick={bookAppointment} className='btn-primary mt-8'>
            Confirm & Book Appointment
          </button>
        </div>

        <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
      </div>
    )
  )
}

export default Appointment
