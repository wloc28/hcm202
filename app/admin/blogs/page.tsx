"use client"

import { BlogList } from "@/components/blog-list"
import { CreateBlogForm } from "@/components/create-blog-form"
import { useLanguage } from "@/contexts/language-context"

export default function AdminblogsPage() {
  const { t } = useLanguage()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('admin.blogs.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('admin.blogs.createNew')}</h2>
          <CreateBlogForm />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">{t('admin.blogs.list')}</h2>
          <BlogList />
        </div>
      </div>
    </div>
  )
}
