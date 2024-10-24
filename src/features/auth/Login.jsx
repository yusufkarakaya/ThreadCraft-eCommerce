import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '../../app/api/authApiSlice'
import { setCredentials } from '../auth/authSlice'

import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading, isSuccess, isError }] = useLoginMutation()

  // State for storing form data
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault() // Prevent form refresh on submit

    // Credentials object
    const credentials = {
      email,
      password,
    }

    try {
      const userData = await login(credentials).unwrap()
      dispatch(setCredentials(userData)) // Store token and user data in Redux
    } catch (error) {
      console.error('Failed to login: ', error)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      navigate('/') // Replace '/dashboard' with your desired route
    }
  }, [isSuccess, navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Welcome Back!
        </h1>
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
          <input
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            type="email"
            placeholder="Enter your email"
            value={email} // Controlled input
            onChange={(e) => setEmail(e.target.value)} // Update state on change
          />
          <input
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            type="password"
            placeholder="Enter your password"
            value={password} // Controlled input
            onChange={(e) => setPassword(e.target.value)} // Update state on change
          />
          <button
            type="submit"
            className="bg-green-800 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {isError && (
          <p className="text-red-500 mt-4 text-center">
            Failed to login. Please check your credentials.
          </p>
        )}
        {isSuccess && (
          <p className="text-green-500 mt-4 text-center">Login successful!</p>
        )}
        <p className="text-sm text-gray-600 mt-6 text-center">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-green-800 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
