// Multi-step auth flow: phone → OTP → onboarding (new users only)
'use client'

import { useState } from 'react'
import PhoneStep from './PhoneStep'
import OtpStep from './OtpStep'
import OnboardingStep from './OnboardingStep'

type Step = 'phone' | 'otp' | 'onboarding'

export default function LoginFlow() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handlePhoneSent(sentPhone: string) {
    setError(null)
    setPhone(sentPhone)
    setStep('otp')
  }

  function handleOtpVerified(isNewUser: boolean) {
    setError(null)
    if (isNewUser) setStep('onboarding')
    // existing user: server action redirects, component unmounts
  }

  function handleChangeNumber() {
    setError(null)
    setStep('phone')
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {step === 'phone' && <PhoneStep onPhoneSent={handlePhoneSent} />}

      {step === 'otp' && (
        <OtpStep
          phone={phone}
          onOtpVerified={handleOtpVerified}
          onChangeNumber={handleChangeNumber}
        />
      )}

      {step === 'onboarding' && <OnboardingStep onError={setError} />}
    </>
  )
}
