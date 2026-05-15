// Multi-step auth flow: email → otp (code entry)
'use client'

import { useState } from 'react'
import EmailStep from './PhoneStep'
import OtpStep from './OtpStep'

type Step = 'email' | 'otp'

export default function LoginFlow() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')

  function handleEmailSent(sentEmail: string) {
    setEmail(sentEmail)
    setStep('otp')
  }

  function handleChangeEmail() {
    setStep('email')
  }

  return (
    <>
      {step === 'email' && <EmailStep onEmailSent={handleEmailSent} />}

      {step === 'otp' && (
        <OtpStep email={email} onChangeEmail={handleChangeEmail} />
      )}
    </>
  )
}
