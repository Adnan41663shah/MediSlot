import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const backendUrl = import.meta.env.VITE_BACKEND_URL
const months = [" ","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }


// Function to calculate the age eg. ( 20_01_2000 => 24 ). Returns "—" for invalid/missing DOB.
    const calculateAge = (dob) => {
        if (dob == null || dob === '') return '—'
        const birthDate = new Date(dob)
        if (Number.isNaN(birthDate.getTime())) return '—'
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        return age < 0 || !Number.isFinite(age) ? '—' : age
    }

  const value={
    calculateAge, slotDateFormat, currency

  }
  return (
<AppContext.Provider value= {value}>
    {props.children}
</AppContext.Provider>

  )

}
export default AppContextProvider