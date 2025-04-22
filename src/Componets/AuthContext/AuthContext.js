// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  )
  const [userRole, setUserRole] = useState(localStorage.getItem('role'))
  const [userToken, setUserToken] = useState(localStorage.getItem('token'))
  const [userID, setUserID] = useState(localStorage.getItem('UUID'))

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')
      const id = localStorage.getItem('UUID')
      setIsAuthenticated(!!token)
      setUserRole(role)
      setUserToken(token)
      setUserID(id)
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = (token, role, id) => {
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    localStorage.setItem('UUID', id)
    setIsAuthenticated(true)
    setUserRole(role)
    setUserToken(token)
    setUserID(id)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('UUID')
    setIsAuthenticated(false)
    setUserRole(null)
    setUserToken(null)
    setUserID(null)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, login, logout, userToken, userID }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
