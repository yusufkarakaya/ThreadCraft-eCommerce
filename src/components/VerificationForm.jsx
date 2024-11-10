import React, { useState, useEffect } from 'react'
import { useVerifyUserMutation } from '../app/api/authApiSlice'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/auth/authSlice'

const VerificationForm = () => {
  const navigate = useNavigate()
  const user = useSelector(selectUser)

  const [verifyUser, { isLoading, error }] = useVerifyUserMutation()
  const [verificationSuccess, setVerificationSuccess] = useState(false)
  const [formValues, setFormValues] = useState({ email: '', code: '' })

  useEffect(() => {
    console.log(user)
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }))
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    try {
      await verifyUser(formValues).unwrap()
      setVerificationSuccess(true)
    } catch (err) {
      console.error('Verification failed:', err)
    }
  }

  useEffect(() => {
    if (verificationSuccess) {
      const timer = setTimeout(() => {
        navigate('/auth/login')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [verificationSuccess, navigate])

  if (verificationSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md p-6 bg-green-100 rounded-lg text-green-800 text-center shadow-md">
          <p>
            Email verified successfully! You'll be redirected in 3 seconds...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Email Verification
        </h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formValues.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="code"
          placeholder="Verification Code"
          value={formValues.code}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 mt-4 text-white font-bold rounded ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-700 hover:bg-green-800 transition-all'
          }`}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
        {error && (
          <p className="mt-4 text-red-600 text-center">{error.message}</p>
        )}
      </form>
    </div>
  )
}

export default VerificationForm
