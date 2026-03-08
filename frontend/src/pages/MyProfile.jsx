import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../utils/toastMessages.js'
import { assets } from '../assets/assets'

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const updateUserProfileData = async () => {
        if (submitting) return
        setSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address || {}))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message || 'Could not update profile.')
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setSubmitting(false)
        }
    }

    if (!userData) return null

    return (
        <div className="py-6 sm:py-8 md:py-10">
            {/* Profile header */}
            <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark p-6 sm:p-8 md:p-10 text-white shadow-soft mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="flex-shrink-0">
                        {isEdit ? (
                            <label htmlFor="profile-image" className="cursor-pointer block group">
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-white/30 group-hover:ring-white/50 transition-all">
                                    <img
                                        className="w-full h-full object-cover bg-primary-muted"
                                        src={image ? URL.createObjectURL(image) : (userData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=0D9488&color=fff`)}
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            if (!image) { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=0D9488&color=fff` }
                                        }}
                                        alt=""
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <img className="w-8 h-8" src={assets.upload_icon} alt="Upload" />
                                        <span className="text-xs font-medium">Change photo</span>
                                    </div>
                                </div>
                                <input
                                    onChange={(e) => setImage(e.target.files[0])}
                                    type="file"
                                    id="profile-image"
                                    accept="image/*"
                                    hidden
                                />
                            </label>
                        ) : (
                            <img
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white/30 bg-white/20"
                                src={userData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=ffffff&color=0D9488`}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=ffffff&color=0D9488`
                                }}
                                alt=""
                            />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        {isEdit ? (
                            <input
                                className="w-full text-xl sm:text-2xl font-bold bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 text-white placeholder-white/70 border-0 focus:ring-2 focus:ring-white/50"
                                type="text"
                                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                                value={userData.name}
                                placeholder="Your name"
                            />
                        ) : (
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{userData.name}</h1>
                        )}
                        <p className="text-white/80 text-sm sm:text-base mt-1">{userData.email}</p>
                        <div className="flex flex-wrap gap-3 mt-4">
                            <NavLink
                                to="/my-appointments"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
                            >
                                View Appointments →
                            </NavLink>
                            {isEdit ? (
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={updateUserProfileData}
                                        disabled={submitting}
                                        className="px-5 py-2.5 rounded-xl bg-white text-primary font-semibold text-sm hover:bg-white/95 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setIsEdit(false); setImage(false) }}
                                        disabled={submitting}
                                        className="px-5 py-2.5 rounded-xl border border-white/40 text-white text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsEdit(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Info cards grid */}
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                {/* Contact information */}
                <div className="card p-5 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="w-10 h-10 rounded-xl bg-primary-muted flex items-center justify-center text-primary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </span>
                        <h3 className="font-semibold text-lg text-text-primary">Contact Information</h3>
                    </div>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">Email</dt>
                            <dd>
                                <a href={`mailto:${userData.email}`} className="text-primary font-medium hover:underline">
                                    {userData.email}
                                </a>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">Phone</dt>
                            <dd>
                                {isEdit ? (
                                    <input
                                        className="input-field"
                                        type="tel"
                                        onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                        value={userData.phone}
                                        placeholder="Your phone number"
                                    />
                                ) : (
                                    <span className="text-text-secondary">{userData.phone || '—'}</span>
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">Address</dt>
                            <dd>
                                {isEdit ? (
                                    <div className="space-y-2">
                                        <input
                                            className="input-field"
                                            type="text"
                                            onChange={(e) => setUserData(prev => ({ ...prev, address: { ...(prev.address || {}), line1: e.target.value } }))}
                                            value={userData.address?.line1 || ''}
                                            placeholder="Address line 1"
                                        />
                                        <input
                                            className="input-field"
                                            type="text"
                                            onChange={(e) => setUserData(prev => ({ ...prev, address: { ...(prev.address || {}), line2: e.target.value } }))}
                                            value={userData.address?.line2 || ''}
                                            placeholder="Address line 2"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-text-secondary">
                                        {userData.address?.line1 ? (
                                            <>{userData.address.line1}{userData.address.line2 && <><br />{userData.address.line2}</>}</>
                                        ) : (
                                            '—'
                                        )}
                                    </span>
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Basic information */}
                <div className="card p-5 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="w-10 h-10 rounded-xl bg-primary-muted flex items-center justify-center text-primary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </span>
                        <h3 className="font-semibold text-lg text-text-primary">Basic Information</h3>
                    </div>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">Gender</dt>
                            <dd>
                                {isEdit ? (
                                    <select
                                        className="input-field"
                                        onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                                        value={userData.gender}
                                    >
                                        <option value="Not Selected">Not Selected</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                ) : (
                                    <span className="text-text-secondary">{userData.gender || '—'}</span>
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">Birthday</dt>
                            <dd>
                                {isEdit ? (
                                    <input
                                        className="input-field"
                                        type="date"
                                        onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                                        value={userData.dob}
                                    />
                                ) : (
                                    <span className="text-text-secondary">{userData.dob || '—'}</span>
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Mobile save/cancel when in edit mode - duplicates actions for visibility */}
            {isEdit && (
                <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:hidden">
                    <button
                        type="button"
                        onClick={() => { setIsEdit(false); setImage(false) }}
                        disabled={submitting}
                        className="btn-secondary py-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button type="button" onClick={updateUserProfileData} disabled={submitting} className="btn-primary py-3 disabled:opacity-70 disabled:cursor-not-allowed">
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default MyProfile
