import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          setAToken(data.token)
          localStorage.setItem('aToken', data.token)
        } else {
          toast.error(data.message || 'Invalid credentials')
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {
          setDToken(data.token)
          localStorage.setItem('dToken', data.token)
        } else {
          toast.error(data.message || 'Invalid credentials')
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Invalid credentials. Please try again.'
      toast.error(message)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-surface-warm p-4'>
      <form onSubmit={onSubmitHandler} className='card p-8 w-full max-w-md'>
        <h1 className='text-2xl font-bold text-text-primary mb-1'><span className='text-primary'>{state}</span> Login</h1>
        <p className='text-text-secondary text-sm mb-6'>Sign in to manage your dashboard</p>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-text-primary mb-1'>Email</label>
            <input onChange={(e) => setEmail(e.target.value)} value={email} className='input-field' type="email" required placeholder="admin@medislot.in" />
          </div>
          <div>
            <label className='block text-sm font-medium text-text-primary mb-1'>Password</label>
            <input onChange={(e) => setPassword(e.target.value)} value={password} className='input-field' type="password" required placeholder="••••••••" />
          </div>
        </div>
        <button type='submit' className='btn-primary w-full py-3 mt-6'>Login</button>
        <p className='text-sm text-text-secondary mt-4'>
          {state === 'Admin' ? 'Doctor?' : 'Admin?'}{' '}
          <span onClick={() => setState(state === 'Admin' ? 'Doctor' : 'Admin')} className='text-primary font-semibold cursor-pointer hover:underline'>
            Switch to {state === 'Admin' ? 'Doctor' : 'Admin'} Login
          </span>
        </p>
      </form>
    </div>
  )
}

export default Login