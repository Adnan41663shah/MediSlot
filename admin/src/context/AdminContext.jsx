import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [appointments, setAppointments] = useState([])

    const [doctors, setDoctors] = useState([])
    const [dashData, setDashData] = useState(false)

    const handleAuthFailure = () => {
        localStorage.removeItem('aToken')
        setAToken('')
        toast.error('Session expired. Please log in again.')
    }

    const isAuthFailure = (error, data) => {
        if (error?.response?.status === 401) return true
        const msg = (data?.message || error?.response?.data?.message || error?.message || '').toLowerCase()
        return msg.includes('not authorized') || msg.includes('session expired')
    }

    useEffect(() => {
        if (!aToken) return
        axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })
            .then(({ data }) => { if (!data.success && isAuthFailure(null, data)) handleAuthFailure() })
            .catch((err) => { if (isAuthFailure(err)) handleAuthFailure() })
    }, [])

    const getAllDoctors = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                if (isAuthFailure(null, data)) handleAuthFailure()
                else toast.error(data.message)
            }

        } catch (error) {
            if (isAuthFailure(error)) handleAuthFailure()
            else toast.error(error?.response?.data?.message || error.message)
        }

    }
    const changeAvailability = async (docId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                if (isAuthFailure(null, data)) handleAuthFailure()
                else toast.error(data.message)
            }

        } catch (error) {
            if (isAuthFailure(error)) handleAuthFailure()
            else toast.error(error?.response?.data?.message || error.message)
        }
    }

    const updateDoctor = async (docId, formData) => {
        try {
            const { data } = await axios.post(backendUrl + `/api/admin/update-doctor/${docId}`, formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
                return true
            } else {
                if (isAuthFailure(null, data)) handleAuthFailure()
                else toast.error(data.message)
                return false
            }
        } catch (error) {
            if (isAuthFailure(error)) handleAuthFailure()
            else toast.error(error?.response?.data?.message || error.message)
            return false
        }
    }

    const deleteDoctor = async (docId) => {
        try {
            const { data } = await axios.delete(backendUrl + `/api/admin/delete-doctor/${docId}`, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
                return true
            } else {
                if (isAuthFailure(null, data)) handleAuthFailure()
                else toast.error(data.message)
                return false
            }
        } catch (error) {
            if (isAuthFailure(error)) handleAuthFailure()
            else toast.error(error?.response?.data?.message || error.message)
            return false
        }
    }

    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                if (isAuthFailure(null, data)) handleAuthFailure()
                else toast.error(data.message)
            }

        } catch (error) {
            if (isAuthFailure(error)) handleAuthFailure()
            else toast.error(error?.response?.data?.message || error.message)
        }

    }

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                if (isAuthFailure(null, data)) handleAuthFailure()
                else toast.error(data.message)
            }

        } catch (error) {
            if (isAuthFailure(error)) handleAuthFailure()
            else toast.error(error?.response?.data?.message || error.message)
        }

    }
    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                if (isAuthFailure(null, data)) handleAuthFailure()
                else toast.error(data.message)
            }

        } catch (error) {
            if (isAuthFailure(error)) handleAuthFailure()
            else toast.error(error?.response?.data?.message || error.message)
        }

    }

    const value = {
        aToken, setAToken,
        backendUrl, doctors,
        getAllDoctors, changeAvailability, updateDoctor, deleteDoctor,
        appointments, setAppointments,
        getAllAppointments, cancelAppointment,
         getDashData, dashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>

    )

}
export default AdminContextProvider