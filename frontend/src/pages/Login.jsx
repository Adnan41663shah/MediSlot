import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../utils/toastMessages.js'
import GoogleSignInButton from '../components/GoogleSignInButton.jsx'

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const [state, setState] = useState('Sign Up')
  const [otpSent, setOtpSent] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const navigate = useNavigate()

  const sendOtp = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/register/send-otp', { name, email, password })
      if (data.success) {
        setOtpSent(true)
        toast.success('OTP sent to your email! Check your inbox.')
        setResendCooldown(60)
      } else {
        toast.error(data.message || 'Could not send OTP. Please try again.')
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      if (state === 'Sign Up') {
        if (!otpSent) {
          await sendOtp()
          return
        }
        const { data } = await axios.post(backendUrl + '/api/user/register/verify-otp', { email, otp })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created successfully!')
        } else {
          toast.error(data.message || 'Invalid OTP. Please try again.')
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message || 'Invalid email or password.')
        }
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async (e) => {
    e.preventDefault()
    if (resendCooldown > 0) return
    await sendOtp()
  }

  const handleBackFromOtp = (e) => {
    e.preventDefault()
    setOtpSent(false)
    setOtp('')
  }

  const handleGoogleSignIn = async (credential) => {
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/auth/google', { idToken: credential })
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success('Signed in successfully!')
      } else {
        toast.error(data.message || 'Google Sign-In failed.')
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center py-8 sm:py-12 md:py-16 px-4'>
      <div className='card flex flex-col gap-5 p-6 sm:p-8 md:p-10 w-full max-w-md'>
        <div>
          <h1 className='text-2xl font-bold text-text-primary'>
            {state === 'Sign Up' ? (otpSent ? 'Verify your email' : 'Create Your Free Account') : 'Welcome Back'}
          </h1>
          <p className='text-text-secondary mt-1 text-sm'>
            {state === 'Sign Up'
              ? otpSent
                ? `We sent a 6-digit OTP to ${email}. Enter it below to complete registration.`
                : 'Join 25,000+ patients. Book appointments, track visits, and get reminders—all in one place.'
              : 'Sign in to manage your appointments and access your health dashboard.'}
          </p>
        </div>

        {state === 'Sign Up' && !otpSent && (
          <>
            <div>
              <label className='block text-sm font-medium text-text-primary mb-1'>Full Name</label>
              <input onChange={(e) => setName(e.target.value)} value={name} className='input-field' type="text" required placeholder="e.g. Priya Sharma" />
            </div>
            <div>
              <label className='block text-sm font-medium text-text-primary mb-1'>Email</label>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='input-field' type="email" required placeholder="you@example.com" />
            </div>
            <div>
              <label className='block text-sm font-medium text-text-primary mb-1'>Password</label>
              <input onChange={(e) => setPassword(e.target.value)} value={password} className='input-field' type="password" required placeholder="••••••••" />
            </div>
          </>
        )}

        {state === 'Sign Up' && otpSent && (
          <>
            <div>
              <label className='block text-sm font-medium text-text-primary mb-1'>Enter OTP</label>
              <input
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                value={otp}
                className='input-field text-center text-xl tracking-[0.5em] font-mono'
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                required
                placeholder="000000"
                autoFocus
              />
            </div>
            <p className='text-sm text-text-secondary'>
              Didn't receive the OTP?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className='text-primary font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </p>
          </>
        )}

        {state !== 'Sign Up' && (
          <>
            <div>
              <label className='block text-sm font-medium text-text-primary mb-1'>Email</label>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='input-field' type="email" required placeholder="you@example.com" />
            </div>
            <div>
              <label className='block text-sm font-medium text-text-primary mb-1'>Password</label>
              <input onChange={(e) => setPassword(e.target.value)} value={password} className='input-field' type="password" required placeholder="••••••••" />
            </div>
          </>
        )}

        <div className='flex flex-col gap-2 mt-2'>
          <button type='submit' className='btn-primary w-full py-3.5' disabled={loading}>
            {loading ? 'Please wait...' : state === 'Sign Up' ? (otpSent ? 'Verify & Create Account' : 'Create Account') : 'Login'}
          </button>

          {!otpSent && (
            <div className='relative py-3'>
              <span className='absolute inset-0 flex items-center' aria-hidden="true">
                <span className='w-full border-t border-stone-200' />
              </span>
              <span className='relative flex justify-center'>
                <span className='bg-surface-card px-3 text-xs text-text-muted'>Or continue with</span>
              </span>
            </div>
          )}

          {!otpSent && (
            <div className='flex justify-center'>
              <GoogleSignInButton
                onSuccess={handleGoogleSignIn}
                onError={(err) => toast.error(getErrorMessage(err))}
                disabled={loading}
              />
            </div>
          )}

          {state === 'Sign Up' && otpSent && (
            <button type='button' onClick={handleBackFromOtp} className='text-sm text-text-secondary hover:text-text-primary'>
              ← Back to edit details
            </button>
          )}
        </div>

        <p className='text-sm text-text-secondary'>
          {state === 'Sign Up' && !otpSent ? 'Already have an account? ' : state === 'Sign Up' ? 'Already have an account? ' : 'New to MediSlot? '}
          <span
            onClick={() => {
              setOtpSent(false)
              setOtp('')
              setState(state === 'Sign Up' ? 'Login' : 'Sign Up')
            }}
            className='text-primary font-semibold cursor-pointer hover:underline'
          >
            {state === 'Sign Up' ? 'Login' : 'Create account'}
          </span>
        </p>
      </div>
    </form>
  )
}

export default Login