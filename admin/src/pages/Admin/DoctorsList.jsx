import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const navigate = useNavigate()
  const { doctors, aToken, getAllDoctors, changeAvailability, deleteDoctor } = useContext(AdminContext)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [availabilityId, setAvailabilityId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const handleAvailabilityChange = async (docId) => {
    if (availabilityId) return
    setAvailabilityId(docId)
    try {
      await changeAvailability(docId)
    } finally {
      setAvailabilityId(null)
    }
  }

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken, getAllDoctors])

  const handleDelete = async (item) => {
    if (deleteConfirm === item._id) {
      if (deletingId) return
      setDeletingId(item._id)
      try {
        const success = await deleteDoctor(item._id)
        if (success) setDeleteConfirm(null)
      } finally {
        setDeletingId(null)
      }
    } else {
      setDeleteConfirm(item._id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <h1 className='text-xl sm:text-2xl font-bold text-text-primary mb-4 sm:mb-6'>All Doctors</h1>
      <div className='card overflow-hidden'>
        <div className='overflow-x-auto max-h-[85vh] overflow-y-auto'>
          <table className='w-full min-w-[500px] border-collapse'>
            <thead className='sticky top-0 bg-stone-50 z-10'>
              <tr>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider w-12'>sr. no</th>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider'>Doctor</th>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider'>Speciality</th>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider'>Available</th>
                <th className='text-left py-4 px-4 text-text-muted text-xs font-semibold uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((item, index) => (
                <tr key={item._id} className='border-t border-stone-100 hover:bg-stone-50/50 transition-colors'>
                  <td className='py-4 px-4 text-text-secondary text-sm'>{index + 1}</td>
                  <td className='py-4 px-4'>
                    <div className='flex items-center gap-3'>
                      <img className='w-12 h-12 rounded-xl object-cover bg-primary-muted flex-shrink-0' src={item.image} alt={item.name} />
                      <span className='font-medium text-text-primary'>{item.name}</span>
                    </div>
                  </td>
                  <td className='py-4 px-4 text-text-secondary text-sm'>{item.speciality}</td>
                  <td className='py-4 px-4'>
                    <label className={`flex items-center gap-2 text-sm ${availabilityId === item._id ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}>
                      <input
                        onChange={() => handleAvailabilityChange(item._id)}
                        type='checkbox'
                        checked={item.available}
                        disabled={!!availabilityId}
                        className='rounded border-stone-300 text-primary focus:ring-primary disabled:cursor-not-allowed'
                      />
                      <span className='text-text-muted'>{availabilityId === item._id ? 'Updating...' : item.available ? 'Yes' : 'No'}</span>
                    </label>
                  </td>
                  <td className='py-4 px-4'>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => navigate(`/edit-doctor/${item._id}`)}
                        className='px-3 py-2 rounded-lg border border-stone-200 text-sm font-medium text-text-secondary hover:bg-primary-muted hover:text-primary hover:border-primary/30 transition-colors'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={!!deletingId}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed ${deleteConfirm === item._id ? 'bg-red-500 text-white hover:bg-red-600' : 'border border-red-200 text-red-600 hover:bg-red-50'}`}
                      >
                        {deletingId === item._id ? 'Deleting...' : deleteConfirm === item._id ? 'Confirm Delete' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DoctorsList
