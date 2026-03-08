import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { getErrorMessage } from '../utils/toastMessages.js'

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const currencySymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [userData, setUserData] = useState(false)

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message || 'Failed to load doctors.')
            }
        } catch (error) {
            console.log(error)
            toast.error(getErrorMessage(error))
        }
    }

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
                headers: { token }
            })

            if (data.success) {
                const u = data.userData
                if (!u) {
                    localStorage.removeItem('token')
                    setToken('')
                    setUserData(false)
                    return
                }
                const safeUserData = {
                    ...u,
                    address: u.address || { line1: '', line2: '' },
                    gender: u.gender || '',
                    dob: u.dob || ''
                }
                setUserData(safeUserData)
            } else {
                if (data.message?.toLowerCase().includes('session expired') || data.message?.toLowerCase().includes('log in again')) {
                    localStorage.removeItem('token')
                    setToken('')
                    setUserData(false)
                }
                toast.error(data.message || 'Failed to load profile.')
            }
        } catch (error) {
            if (error.response?.status === 401 || error.response?.data?.message?.toLowerCase().includes('session expired')) {
                localStorage.removeItem('token')
                setToken('')
                setUserData(false)
            }
            toast.error(getErrorMessage(error))
        }
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    const value = {
        doctors, getDoctorsData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
