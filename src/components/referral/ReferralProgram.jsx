import React, { useState } from 'react'
import { FiGift, FiUsers, FiCopy, FiShare2 } from 'react-icons/fi'
import { useGetReferralInfoQuery, useGenerateReferralCodeMutation } from '../../features/referral/referralSlice'
import Button from '../ui/Button'
import Card from '../ui/Card'

const ReferralProgram = () => {
  const { data: referralInfo } = useGetReferralInfoQuery()
  const [generateCode] = useGenerateReferralCodeMutation()
  const [copied, setCopied] = useState(false)

  const handleGenerateCode = async () => {
    try {
      await generateCode().unwrap()
    } catch (err) {
      console.error('Failed to generate referral code:', err)
    }
  }

  const handleCopyCode = () => {
    if (referralInfo?.referralCode) {
      navigator.clipboard.writeText(referralInfo.referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    if (navigator.share && referralInfo?.referralCode) {
      try {
        await navigator.share({
          title: 'Join me on our store!',
          text: `Use my referral code ${referralInfo.referralCode} to get a discount on your first purchase!`,
          url: window.location.origin,
        })
      } catch (err) {
        console.error('Failed to share:', err)
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Referral Program</h2>
        <p className="mt-2 text-gray-600">
          Invite friends and earn rewards when they make their first purchase
        </p>
      </div>

      {/* How it Works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <FiShare2 className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Share Your Code</h3>
          <p className="mt-2 text-sm text-gray-600">
            Share your unique referral code with friends and family
          </p>
        </div>
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <FiUsers className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Friends Join</h3>
          <p className="mt-2 text-sm text-gray-600">
            They get 10% off their first purchase using your code
          </p>
        </div>
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <FiGift className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Earn Rewards</h3>
          <p className="mt-2 text-sm text-gray-600">
            You get $10 store credit for each successful referral
          </p>
        </div>
      </div>

      {/* Referral Code Section */}
      <Card className="mb-8">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Your Referral Code
          </h3>
          {referralInfo?.referralCode ? (
            <div className="flex items-center space-x-4">
              <code className="flex-1 bg-gray-100 p-3 rounded-lg text-lg font-mono">
                {referralInfo.referralCode}
              </code>
              <Button
                variant="outline"
                onClick={handleCopyCode}
                className="flex items-center space-x-2"
              >
                <FiCopy className="h-5 w-5" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
              <Button
                variant="primary"
                onClick={handleShare}
                className="flex items-center space-x-2"
              >
                <FiShare2 className="h-5 w-5" />
                <span>Share</span>
              </Button>
            </div>
          ) : (
            <Button variant="primary" onClick={handleGenerateCode}>
              Generate Referral Code
            </Button>
          )}
        </div>
      </Card>

      {/* Stats and Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Your Referrals
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {referralInfo?.totalReferrals || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Successful Referrals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {referralInfo?.successfulReferrals || 0}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Your Rewards
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Available Credits</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${referralInfo?.availableCredits || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${referralInfo?.totalEarned || 0}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Referrals */}
      {referralInfo?.recentReferrals?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Referrals
          </h3>
          <div className="space-y-4">
            {referralInfo.recentReferrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">{referral.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(referral.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant={referral.status === 'completed' ? 'success' : 'warning'}
                >
                  {referral.status === 'completed' ? 'Completed' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReferralProgram 