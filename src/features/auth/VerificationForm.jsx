import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVerifyUserMutation } from '../../app/api/authApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './authSlice'
import Container from '../../components/ui/Container'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const VerificationForm = () => {
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const [verifyUser, { isLoading }] = useVerifyUserMutation()

  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await verifyUser({ verificationCode }).unwrap()
      setSuccess('Email verified successfully!')
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      setError(err?.data?.message || 'Verification failed. Please try again.')
    }
  }

  if (!user) {
    return (
      <Container size="sm">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Badge variant="error" size="lg">
              Access Denied
            </Badge>
            <p className="mt-4 text-gray-600">
              Please log in to access this page.
            </p>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container size="sm">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verify Your Email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a verification code to your email address. Please enter it
              below to verify your account.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-green-700">{success}</p>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Verification Code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Verify Email
            </Button>

            <p className="text-xs text-center text-gray-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                className="text-green-600 hover:text-green-500 font-medium"
                onClick={() => {
                  // Add resend verification code logic here
                  alert('Resend functionality will be implemented soon.')
                }}
              >
                Resend Code
              </button>
            </p>
          </form>
        </div>
      </div>
    </Container>
  )
}

export default VerificationForm 