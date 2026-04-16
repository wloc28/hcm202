"use client"

import { BlogReader } from "@/components/blog-reader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { blogData, type BlogId } from "@/data/blog-data"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import React from "react"

interface BlogPageProps {
  params: Promise<{ id: string }>
}

export default function BlogPage({ params }: BlogPageProps) {
  const { t, currentLanguage } = useLanguage()
  
  // Use React.use() to unwrap the Promise
  const { id } = React.use(params)
  const blogId = Number.parseInt(id) as BlogId
  const blog = blogData[blogId]

  if (!blog) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50/40 to-white dark:from-red-950 dark:via-red-900/60 dark:to-amber-950/30">
      {/* Enhanced Header with Background Effects */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-red-600/15 via-red-500/15 to-amber-400/15 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-1/3 w-48 h-48 bg-gradient-to-r from-red-400/12 to-yellow-300/12 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {/* Back Navigation */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="text-red-700/80 dark:text-yellow-200/80 hover:text-red-500 dark:hover:text-yellow-100">
              <Link href="/blogs" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('blog.backToArticles')}
              </Link>
            </Button>
          </div>

          {/* Hero Section */}
          <div className="w-full mx-auto mb-16">
            <div className="relative mb-12">
              {/* Featured Image */}
              <div className="relative w-full h-80 md:h-96 lg:h-[32rem] rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
                <Image
                  src={blog.image || '/placeholder.svg'}
                  alt={blog.title[currentLanguage]}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Badges on image */}
                <div className="absolute top-6 left-6 flex gap-3 z-20">
                  {blog.section && (
                    <Badge variant="outline" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-sm px-3 py-1">
                      {blog.section}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-sm px-3 py-1">
                    {t(`blog.languageLabels.${blog.originalLanguage}` as any)}
                  </Badge>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-8 left-8 right-8 z-20">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    {blog.title[currentLanguage]}
                  </h1>
                  
                  {/* Meta information */}
                  <div className="flex flex-wrap items-center gap-6 text-white/90 text-base">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {blog.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {blog.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {blog.readTime[currentLanguage]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div className="mt-12 max-w-5xl mx-auto text-center">
                <p className="text-2xl md:text-3xl leading-relaxed font-light text-red-900/80 dark:text-amber-100/80">
                  {blog.excerpt[currentLanguage]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full px-4 pb-16">
        {/* Enhanced Content Card */}
        <div className="relative max-w-7xl mx-auto">
          {/* Background decoration for content */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-amber-50/50 to-red-50/40 dark:from-red-950/70 dark:via-red-900/50 dark:to-amber-950/40 rounded-3xl blur-xl"></div>

          <div className="relative bg-white/85 dark:bg-red-950/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-12 border border-red-200/50 dark:border-red-800/50 shadow-lg shadow-red-900/20">
            <BlogReader blog={blog} />
          </div>
        </div>
      </div>
    </div>
  )
}