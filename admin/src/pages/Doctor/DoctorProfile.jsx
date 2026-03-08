import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
    const { currency} = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {

        try {

            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div className='p-4 sm:p-6 lg:p-8'>
            <div className='flex flex-col lg:flex-row gap-8 max-w-4xl'>
                <img className='w-full lg:w-64 aspect-square object-cover rounded-2xl' src={profileData.image} alt={profileData.name} />
                <div className='flex-1 card p-6 sm:p-8'>
                    <h1 className='text-2xl font-bold text-text-primary'>{profileData.name}</h1>
                    <div className='flex items-center gap-2 mt-1 text-text-secondary'><span>{profileData.degree} — {profileData.speciality}</span><span className='px-2 py-0.5 rounded-lg bg-primary-muted text-primary text-xs font-medium'>{profileData.experience}</span></div>
                    <div className='mt-6'><h3 className='font-semibold text-text-primary mb-2'>About</h3>{isEdit ? <textarea onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} className='input-field min-h-[120px]' rows={5} value={profileData.about} /> : <p className='text-text-secondary text-sm'>{profileData.about}</p>}</div>
                    <p className='text-text-secondary mt-4'>Appointment fee: <span className='font-semibold text-text-primary'>{currency}{isEdit ? <input type='number' onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} className='input-field w-24 inline-block' /> : profileData.fees}</span></p>
                    <div className='mt-4'><label className='block text-sm font-medium text-text-primary mb-2'>Address</label>{isEdit ? <div className='space-y-2'><input className='input-field' type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...(prev.address || {}), line1: e.target.value } }))} value={profileData.address?.line1} /><input className='input-field' type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...(prev.address || {}), line2: e.target.value } }))} value={profileData.address?.line2} /></div> : <p className='text-text-secondary text-sm'>{profileData.address?.line1}<br />{profileData.address?.line2}</p>}</div>
                    <label className='mt-4 flex items-center gap-2 cursor-pointer'><input type="checkbox" onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} className='rounded border-stone-300 text-primary' /><span className='text-text-muted text-sm'>Available for appointments</span></label>
                    <div className='mt-6'>{isEdit ? <button onClick={updateProfile} className='btn-primary'>Save Changes</button> : <button onClick={() => setIsEdit(true)} className='btn-secondary'>Edit Profile</button>}</div>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile