import { useState, useEffect } from 'react'
import { useRegisterMutation } from '../../app/api/authApiSlice'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const [register, { isSuccess, isError }] = useRegisterMutation()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordValidate, setPasswordValidate] = useState('')
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== passwordValidate) {
      setFormError('Passwords do not match.')
    }

    try {
      if (password === passwordValidate) {
        await register({ username, email, password }).unwrap()
        console.log('passwords are matched.')
      }
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      navigate('/auth/verification')
    }
  }, [isSuccess, navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-center text-gray-800 font-bold text-3xl mb-6">
          Sign Up
        </h1>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            className="p-3 border border-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600 rounded-lg transition-all"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Please enter your username"
          />
          <input
            className="p-3 border border-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600 rounded-lg transition-all"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Please enter your email"
          />
          <input
            className="p-3 border border-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600 rounded-lg transition-all"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Please enter your password"
          />
          <input
            className="p-3 border border-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600 rounded-lg transition-all"
            type="password"
            value={passwordValidate}
            onChange={(e) => setPasswordValidate(e.target.value)}
            placeholder="Please enter your password again"
          />
          <button className="bg-green-800 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out">
            Register
          </button>
        </form>
        {formError && (
          <div className="text-red-500 text-center mt-4">{formError}</div>
        )}
        {isError && (
          <div className="text-red-500 text-center mt-4">
            Registration failed. Please try again.
          </div>
        )}
      </div>
    </div>
  )
}

export default Register
