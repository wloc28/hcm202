"use client"

import { useState } from "react"
import emailjs from "@emailjs/browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Send } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// --- Thay info của mày ở đây ---
const EMAILJS_SERVICE_ID = "service_t5uxgqc"
const EMAILJS_TEMPLATE_ID = "template_9r5hza7"
const EMAILJS_PUBLIC_KEY = "jDLXDlrmmaCwOBcIO"
const ADMIN_NAME = "Vinh" // Tên người nhận góp ý (to_name)
// -------------------------------

export function FeedbackForm() {
  const { t } = useLanguage()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
    to_name: ADMIN_NAME, // luôn truyền field này lên EmailJS
  })

  // Xử lý nhập
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Đảm bảo khi nhập vẫn giữ đúng ADMIN_NAME cho to_name
      to_name: ADMIN_NAME,
    }))
  }

  // Xử lý gửi form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formData,
        EMAILJS_PUBLIC_KEY
      )
      setIsSubmitted(true)
    } catch (err: any) {
      setError(t('feedback.form.errorMessage'))
    } finally {
      setIsLoading(false)
    }
  }

  // Nếu gửi thành công
  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h2 className="mb-2 text-2xl font-bold text-red-700 dark:text-yellow-200">
            {t('feedback.form.successTitle')}
          </h2>
          <p className="mb-6 text-muted-foreground">
            {t('feedback.form.successMessage')}
          </p>
          <Button onClick={() => setIsSubmitted(false)}>
            {t('feedback.form.successButton')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // UI Form
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('feedback.form.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Tên người gửi */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('feedback.form.nameLabel')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          {/* Email người gửi */}
          <div className="space-y-2">
            <Label htmlFor="email">{t('feedback.form.emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          {/* Loại góp ý */}
          <div className="space-y-2">
            <Label htmlFor="category">{t('feedback.form.categoryLabel')}</Label>
            <select
              id="category"
              value={formData.category}
              onChange={e => handleInputChange("category", e.target.value)}
              required
              className="w-full rounded border border-red-200 bg-background p-2 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="" disabled>
                {t('feedback.form.categoryPlaceholder')}
              </option>
              <option value="bug">{t('feedback.form.categories.bug')}</option>
              <option value="feature">{t('feedback.form.categories.feature')}</option>
              <option value="content">{t('feedback.form.categories.content')}</option>
              <option value="general">{t('feedback.form.categories.general')}</option>
            </select>
          </div>

          {/* Tiêu đề góp ý */}
          <div className="space-y-2">
            <Label htmlFor="subject">{t('feedback.form.subjectLabel')}</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              required
            />
          </div>

          {/* Nội dung góp ý */}
          <div className="space-y-2">
            <Label htmlFor="message">{t('feedback.form.messageLabel')}</Label>
            <Textarea
              id="message"
              rows={6}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              required
            />
          </div>

          {/* Nút gửi */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              t('feedback.form.submitting')
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {t('feedback.form.submit')}
              </>
            )}
          </Button>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
