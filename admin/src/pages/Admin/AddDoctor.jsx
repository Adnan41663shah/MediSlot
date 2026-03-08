import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddDoctor = () => {
  const [submitting, setSubmitting] = useState(false)
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

  const { backendUrl } = useContext(AdminContext)
  const { aToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (submitting) return

    try {
      if (!docImg) {
        return toast.error('Image Not Selected');
      }

      setSubmitting(true)
      const formData = new FormData();

      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

      const response = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { aToken } })
      const data = response.data;
      if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <form onSubmit={onSubmitHandler} className='p-4 sm:p-6 lg:p-8 w-full max-w-4xl'>
      <h1 className='text-xl sm:text-2xl font-bold text-text-primary mb-4 sm:mb-6'>Add Doctor</h1>
      <div className='card p-4 sm:p-6 lg:p-8 max-h-[calc(100vh-12rem)] overflow-y-auto'>
        <div className='flex items-center gap-4 mb-8'>
          <label htmlFor="doc-img" className='cursor-pointer'>
            <div className='w-24 h-24 rounded-2xl bg-primary-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary transition-colors'>
              <img className='w-full h-full object-cover' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
            </div>
            <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" accept="image/*" hidden />
          </label>
          <p className='text-text-muted text-sm'>Upload doctor photo</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
          <div className='space-y-4'>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Name</label><input onChange={e => setName(e.target.value)} value={name} className='input-field' type="text" placeholder='Dr. Jane Smith' required /></div>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Email</label><input onChange={e => setEmail(e.target.value)} value={email} className='input-field' type="email" placeholder='doctor@medislot.in' required /></div>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Password</label><input onChange={e => setPassword(e.target.value)} value={password} className='input-field' type="password" placeholder='••••••••' required /></div>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Experience</label><select onChange={e => setExperience(e.target.value)} value={experience} className='input-field'><option value="1 Year">1 Year</option><option value="2 Year">2 Years</option><option value="3 Year">3 Years</option><option value="4 Year">4 Years</option><option value="5 Year">5 Years</option><option value="6 Year">6 Years</option><option value="8 Year">8 Years</option><option value="9 Year">9 Years</option><option value="10 Year">10+ Years</option></select></div>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Fees (₹)</label><input onChange={e => setFees(e.target.value)} value={fees} className='input-field' type="number" placeholder='500' required /></div>
          </div>
          <div className='space-y-4'>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Speciality</label><select onChange={e => setSpeciality(e.target.value)} value={speciality} className='input-field'><option value="General physician">General physician</option><option value="Gynecologist">Gynecologist</option><option value="Dermatologist">Dermatologist</option><option value="Pediatricians">Pediatricians</option><option value="Neurologist">Neurologist</option><option value="Gastroenterologist">Gastroenterologist</option></select></div>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Degree</label><input onChange={e => setDegree(e.target.value)} value={degree} className='input-field' type="text" placeholder='MBBS, MD' required /></div>
            <div><label className='block text-sm font-medium text-text-primary mb-1'>Address</label><input onChange={e => setAddress1(e.target.value)} value={address1} className='input-field mb-2' type="text" placeholder='Address line 1' required /><input onChange={e => setAddress2(e.target.value)} value={address2} className='input-field' type="text" placeholder='Address line 2' required /></div>
          </div>
        </div>

        <div className='mt-6'>
          <label className='block text-sm font-medium text-text-primary mb-1'>About Doctor</label>
          <textarea onChange={e => setAbout(e.target.value)} value={about} className='input-field min-h-[120px]' rows={4} placeholder='Brief description of the doctor...'></textarea>
        </div>

        <button type='submit' disabled={submitting} className='btn-primary mt-8 disabled:opacity-70 disabled:cursor-not-allowed'>
          {submitting ? 'Adding...' : 'Add Doctor'}
        </button>
      </div>
    </form>
  )
}

export default AddDoctor