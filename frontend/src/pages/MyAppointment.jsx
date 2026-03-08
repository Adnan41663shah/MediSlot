import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../utils/toastMessages.js'
import { assets } from '../assets/assets'

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [payment, setPayment] = useState('')

  const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const [day, month, year] = slotDate.split('_')
    return `${day} ${months[Number(month)]} ${year}`
  }

  // Getting User Appointments Data Using API
  const getUserAppointments = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      setAppointments(data.appointments.reverse())

    } catch (error) {
      console.log(error)
      toast.error(getErrorMessage(error))
    }
  }

  // Function to cancel appointment Using API
  const cancelAppointment = async (appointmentId) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        // Optimistic UI update - hide buttons immediately
        setAppointments(prev => prev.map(a => a._id === appointmentId ? { ...a, cancelled: true } : a))
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message || 'Could not cancel appointment.')
      }

    } catch (error) {
      console.log(error)
      toast.error(getErrorMessage(error))
    }

  }

  const initPay = (order) => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!razorpayKey) {
      toast.error('Online payment is not available at the moment. Please try again later.')
      return
    }
    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {

        console.log(response)

        try {
          const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
          if (data.success) {
            navigate('/my-appointments')
            getUserAppointments()
          }
        } catch (error) {
          console.log(error)
          toast.error(getErrorMessage(error))
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  // Function to make payment using razorpay
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
      if (data.success) {
        initPay(data.order)
      } else {
        toast.error(data.message || 'Could not process payment.')
      }
    } catch (error) {
      console.log(error)
      toast.error(getErrorMessage(error))
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div className='py-6 sm:py-8'>
      <div className='mb-5 sm:mb-6'>
        <h1 className='text-xl sm:text-2xl font-bold text-text-primary'>My Appointments</h1>
        <p className='text-text-secondary text-sm mt-1'>View, manage, and pay for your upcoming and past consultations.</p>
      </div>
      <div className='space-y-4'>
        {appointments.length === 0 ? (
          <div className='card p-12 text-center'>
            <p className='text-5xl mb-4 opacity-40'>📅</p>
            <h3 className='text-lg font-semibold text-text-primary'>No appointments yet</h3>
            <p className='text-text-secondary mt-2 text-sm max-w-sm mx-auto'>Browse our doctor directory and book your first consultation. We'll send you reminders so you never miss an appointment.</p>
            <button onClick={() => navigate('/doctors')} className='btn-primary mt-6'>Browse Doctors</button>
          </div>
        ) : appointments.map((item) => (
          <div key={item._id} className='card p-6 flex flex-col sm:flex-row gap-4 sm:items-center'>
            <img className='w-24 h-24 rounded-xl object-cover bg-primary-muted' src={item.docData.image} alt="" />
            <div className='flex-1 min-w-0'>
              <p className='font-semibold text-text-primary'>{item.docData.name}</p>
              <p className='text-text-secondary text-sm'>{item.docData.speciality}</p>
              <p className='text-text-secondary text-sm mt-1'>{item.docData.address?.line1}, {item.docData.address?.line2}</p>
              <p className='text-text-muted text-sm mt-1'>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div className='flex flex-wrap gap-2 sm:flex-col sm:min-w-[140px]'>
              {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                <button onClick={() => setPayment(item._id)} className='btn-secondary text-sm py-2'>Pay Online</button>
              )}
              {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                <button onClick={() => appointmentRazorpay(item._id)} className='flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-stone-200 hover:border-primary/50'>
                  <img className='h-5' src={assets.razorpay_logo} alt="Razorpay" />
                </button>
              )}
              {!item.cancelled && item.payment && !item.isCompleted && (
                <span className='inline-flex items-center px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium'>Paid</span>
              )}
              {item.isCompleted && (
                <span className='inline-flex items-center px-4 py-2 rounded-xl border border-emerald-500 text-emerald-600 text-sm font-medium'>Completed</span>
              )}
              {!item.cancelled && !item.isCompleted && (
                <button onClick={() => cancelAppointment(item._id)} className='text-sm py-2 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors'>Cancel</button>
              )}
              {item.cancelled && !item.isCompleted && (
                <span className='inline-flex items-center px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm'>Cancelled</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
