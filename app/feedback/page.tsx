"use client"

import { FeedbackForm } from "@/components/feedback-form"
import { useLanguage } from "@/contexts/language-context"

export default function FeedbackPage() {
  const { t } = useLanguage()
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">{t('feedback.pageTitle')}</h1>
        <p className="text-muted-foreground">
          {t('feedback.pageDescription')}
        </p>
      </div>

      <FeedbackForm />
    </div>
  )
}
