import React, { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'

const EditDoctor = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { doctors, aToken, getAllDoctors, updateDoctor } = useContext(AdminContext)

  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const doctor = doctors.find(d => d._id === docId)

  useEffect(() => {
    const loadDoctor = async () => {
      if (!doctor && docId && aToken) {
        await getAllDoctors()
      }
      setLoading(false)
    }
    loadDoctor()
  }, [docId, aToken, doctor, getAllDoctors])

  useEffect(() => {
    if (doctor) {
      setName(doctor.name || '')
      setEmail(doctor.email || '')
      setExperience(doctor.experience || '1 Year')
      setFees(String(doctor.fees || ''))
      setAbout(doctor.about || '')
      setSpeciality(doctor.speciality || 'General physician')
      setDegree(doctor.degree || '')
      setAddress1(doctor.address?.line1 || '')
      setAddress2(doctor.address?.line2 || '')
    }
  }, [doctor])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (submitting) return
    if (!name || !email || !speciality || !degree || !fees) {
      toast.error('Please fill required fields')
      return
    }

    setSubmitting(true)
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    if (password) formData.append('password', password)
    formData.append('experience', experience)
    formData.append('fees', Number(fees))
    formData.append('about', about)
    formData.append('speciality', speciality)
    formData.append('degree', degree)
    formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))
    if (docImg) formData.append('image', docImg)

    try {
      const success = await updateDoctor(docId, formData)
      if (success) navigate('/doctor-list')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !doctor) {
    return (
      <div className='p-4 sm:p-6 lg:p-8'>
        <p className='text-text-secondary'>{loading ? 'Loading...' : 'Doctor not found'}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmitHandler} className='p-4 sm:p-6 lg:p-8 w-full max-w-4xl'>
      <h1 className='text-xl sm:text-2xl font-bold text-text-primary mb-4 sm:mb-6'>Edit Doctor</h1>
      <div className='card p-4 sm:p-6 lg:p-8 max-h-[calc(100vh-12rem)] overflow-y-auto'>
        <div className='flex items-center gap-4 mb-8'>
          <label htmlFor="edit-doc-img" className='cursor-pointer'>
            <div className='w-24 h-24 rounded-2xl bg-primary-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary transition-colors'>
              <img className='w-full h-full object-cover' src={docImg ? URL.createObjectURL(docImg) : doctor.image || assets.upload_area} alt="" />
            </div>
            <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="edit-doc-img" accept="image/*" hidden />
          </label>
          <p className='text-text-muted text-sm'>Change photo (optional)</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
          <div className='space-y-4'>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Name</label><input onChange={e => setName(e.target.value)} value={name} className='input-field' type="text" placeholder='Dr. Jane Smith' required /></div>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Email</label><input onChange={e => setEmail(e.target.value)} value={email} className='input-field' type="email" placeholder='doctor@medislot.in' required /></div>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Password</label><input onChange={e => setPassword(e.target.value)} value={password} className='input-field' type="password" placeholder='Leave blank to keep current' /></div>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Experience</label><select onChange={e => setExperience(e.target.value)} value={experience} className='input-field'><option value="1 Year">1 Year</option><option value="2 Year">2 Years</option><option value="3 Year">3 Years</option><option value="4 Year">4 Years</option><option value="5 Year">5 Years</option><option value="6 Year">6 Years</option><option value="8 Year">8 Years</option><option value="9 Year">9 Years</option><option value="10 Year">10+ Years</option></select></div>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Fees (₹)</label><input onChange={e => setFees(e.target.value)} value={fees} className='input-field' type="number" placeholder='500' required /></div>
          </div>
          <div className='space-y-4'>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Speciality</label><select onChange={e => setSpeciality(e.target.value)} value={speciality} className='input-field'><option value="General physician">General physician</option><option value="Gynecologist">Gynecologist</option><option value="Dermatologist">Dermatologist</option><option value="Pediatricians">Pediatricians</option><option value="Neurologist">Neurologist</option><option value="Gastroenterologist">Gastroenterologist</option></select></div>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Degree</label><input onChange={e => setDegree(e.target.value)} value={degree} className='input-field' type="text" placeholder='MBBS, MD' required /></div>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Address</label><input onChange={e => setAddress1(e.target.value)} value={address1} className='input-field mb-2' type="text" placeholder='Address line 1' required /><input onChange={e => setAddress2(e.target.value)} value={address2} className='input-field' type="text" placeholder='Address line 2' /></div>
          </div>
        </div>

        <div className='mt-6'>
          <label className='block text-sm font-medium text-text-primary mb-1'>About Doctor</label>
          <textarea onChange={e => setAbout(e.target.value)} value={about} className='input-field min-h-[120px]' rows={4} placeholder='Brief description of the doctor...'></textarea>
        </div>

        <div className='flex gap-3 mt-8'>
          <button type='button' onClick={() => navigate('/doctor-list')} disabled={submitting} className='btn-secondary disabled:opacity-70 disabled:cursor-not-allowed'>Cancel</button>
          <button type='submit' disabled={submitting} className='btn-primary disabled:opacity-70 disabled:cursor-not-allowed'>{submitting ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </form>
  )
}

export default EditDoctor
