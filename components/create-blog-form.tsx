"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function CreateBlogForm() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    language: "",
    image: "",
  })

  const [quizQuestions, setQuizQuestions] = useState([{ question: "", options: ["", "", "", ""], correct: 0 }])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating blog:", { ...formData, quiz: quizQuestions })
    // Here you would send data to your backend
    alert(t('blog.createSuccess'))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addQuizQuestion = () => {
    setQuizQuestions((prev) => [...prev, { question: "", options: ["", "", "", ""], correct: 0 }])
  }

  const updateQuizQuestion = (index: number, field: string, value: string | number) => {
    setQuizQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)))
  }

  const updateQuizOption = (questionIndex: number, optionIndex: number, value: string) => {
    setQuizQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex ? { ...q, options: q.options.map((opt, j) => (j === optionIndex ? value : opt)) } : q,
      ),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('form.createBlog')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('form.title')}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">{t('form.language')}</Label>
            <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('form.selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vietnamese">{t('language.vietnamese')}</SelectItem>
                <SelectItem value="english">{t('language.english')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">{t('form.excerpt')}</Label>
            <Textarea
              id="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={(e) => handleInputChange("excerpt", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t('form.content')}</Label>
            <Textarea
              id="content"
              rows={10}
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">{t('form.imageUrl')}</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleInputChange("image", e.target.value)}
              placeholder={t('form.imageUrlPlaceholder')}
            />
          </div>

          {/* Quiz Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t('form.quizQuestions')}</Label>
              <Button type="button" onClick={addQuizQuestion} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                {t('form.addQuestion')}
              </Button>
            </div>

            {quizQuestions.map((quiz, qIndex) => (
              <Card key={qIndex} className="p-4">
                <div className="space-y-3">
                  <Input
                    placeholder={`${t('form.question')} ${qIndex + 1}`}
                    value={quiz.question}
                    onChange={(e) => updateQuizQuestion(qIndex, "question", e.target.value)}
                  />

                  {quiz.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <Input
                        placeholder={`${t('form.answer')} ${oIndex + 1}`}
                        value={option}
                        onChange={(e) => updateQuizOption(qIndex, oIndex, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant={quiz.correct === oIndex ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateQuizQuestion(qIndex, "correct", oIndex)}
                      >
                        {quiz.correct === oIndex ? t('form.correct') : t('form.select')}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <Button type="submit" className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {t('form.createBlog')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
