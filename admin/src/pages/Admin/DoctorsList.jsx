import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const navigate = useNavigate()
  const { doctors, aToken, getAllDoctors, changeAvailability, deleteDoctor } = useContext(AdminContext)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  const handleDelete = async (item) => {
    if (deleteConfirm === item._id) {
      const success = await deleteDoctor(item._id)
      if (success) setDeleteConfirm(null)
    } else {
      setDeleteConfirm(item._id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  return (
    <div className='p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto'>
      <h1 className='text-xl sm:text-2xl font-bold text-text-primary mb-4 sm:mb-6'>All Doctors</h1>
      <div className='grid grid-cols-auto gap-6'>
        {doctors.map((item, index) => (
          <div className='card overflow-hidden max-w-56 group' key={item._id}>
            <div className='aspect-[4/3] bg-primary-muted overflow-hidden'>
              <img className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' src={item.image} alt={item.name} />
            </div>
            <div className='p-4'>
              <p className='font-semibold text-text-primary'>{item.name}</p>
              <p className='text-text-secondary text-sm'>{item.speciality}</p>
              <label className='mt-3 flex items-center gap-2 cursor-pointer text-sm'>
                <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} className='rounded border-stone-300 text-primary focus:ring-primary' />
                <span className='text-text-muted'>Available</span>
              </label>
              <div className='flex gap-2 mt-4'>
                <button onClick={() => navigate(`/edit-doctor/${item._id}`)} className='flex-1 px-3 py-2 rounded-lg border border-stone-200 text-sm font-medium text-text-secondary hover:bg-primary-muted hover:text-primary hover:border-primary/30 transition-colors'>
                  Edit
                </button>
                <button onClick={() => handleDelete(item)} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${deleteConfirm === item._id ? 'bg-red-500 text-white hover:bg-red-600' : 'border border-red-200 text-red-600 hover:bg-red-50'}`}>
                  {deleteConfirm === item._id ? 'Confirm Delete' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList