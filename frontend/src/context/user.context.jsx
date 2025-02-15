/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState } from 'react'

export const userContext = createContext()

const UserProvider = ({children}) => {
    const [user, setUser] = useState(null)
  return (
    <userContext.Provider value={{user, setUser}}>
      {children}
    </userContext.Provider>
  )
}

export default UserProvider