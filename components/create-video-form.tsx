"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, LinkIcon, Save } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function CreateVideoForm() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    localFile: null as File | null,
    thumbnail: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating video:", formData)
    // Here you would send data to your backend
    alert(t('video.createSuccess'))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, localFile: file }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('video.addVideo')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('form.videoTitle')}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('form.description')}</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">{t('form.thumbnailUrl')}</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) => handleInputChange("thumbnail", e.target.value)}
              placeholder={t('form.thumbnailUrlPlaceholder')}
            />
          </div>

          <Tabs defaultValue="youtube" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="youtube">{t('video.youtubeUrl')}</TabsTrigger>
              <TabsTrigger value="upload">{t('video.uploadLocal')}</TabsTrigger>
            </TabsList>

            <TabsContent value="youtube" className="space-y-2">
              <Label htmlFor="youtube-url">{t('video.youtubeUrl')}</Label>
              <div className="flex gap-2">
                <LinkIcon className="h-4 w-4 mt-3 text-muted-foreground" />
                <Input
                  id="youtube-url"
                  value={formData.youtubeUrl}
                  onChange={(e) => handleInputChange("youtubeUrl", e.target.value)}
                  placeholder={t('video.youtubeUrlPlaceholder')}
                />
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-2">
              <Label htmlFor="local-file">{t('video.uploadFile')}</Label>
              <div className="flex gap-2">
                <Upload className="h-4 w-4 mt-3 text-muted-foreground" />
                <Input id="local-file" type="file" accept="video/*" onChange={handleFileChange} />
              </div>
              {formData.localFile && (
                <p className="text-sm text-muted-foreground">{t('form.fileSelected')}: {formData.localFile.name}</p>
              )}
            </TabsContent>
          </Tabs>

          <Button type="submit" className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {t('video.addVideo')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
