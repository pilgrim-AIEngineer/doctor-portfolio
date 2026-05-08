// Multi-step auth flow: email → check-email (magic link sent)
'use client'

import { useState } from 'react'
import EmailStep from './PhoneStep'
import CheckEmailStep from './OtpStep'

type Step = 'email' | 'check-email'

export default function LoginFlow() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')

  function handleEmailSent(sentEmail: string) {
    setEmail(sentEmail)
    setStep('check-email')
  }

  function handleChangeEmail() {
    setStep('email')
  }

  return (
    <>
      {step === 'email' && <EmailStep onEmailSent={handleEmailSent} />}

      {step === 'check-email' && (
        <CheckEmailStep email={email} onChangeEmail={handleChangeEmail} />
      )}
    </>
  )
}
