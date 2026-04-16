'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useLanguage } from '@/contexts/language-context'
import { Clock, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Blog {
    id: number
    title: Record<string, string>
    excerpt: Record<string, string>
    author: string
    date: string
    readTime: Record<string, string>
    image: string
    originalLanguage: string
    section?: string
}

interface BlogCardClientProps {
    blog: Blog
}

export function BlogCardClient({ blog }: BlogCardClientProps) {
    const { currentLanguage, getLocalizedContent, t } = useLanguage()

    const getLanguageBadge = (language: string) => {
        const badges = {
            vietnamese: {
                label: t('language.vietnamese'),
                variant: 'default' as const,
            },
            english: {
                label: t('language.english'),
                variant: 'secondary' as const,
            },
        }
        return badges[language as keyof typeof badges] || badges.vietnamese
    }

    const languageBadge = getLanguageBadge(blog.originalLanguage)
    const currentTitle = getLocalizedContent(blog.title)
    const currentExcerpt = getLocalizedContent(blog.excerpt)
    const currentReadTime = getLocalizedContent(blog.readTime)

    return (
        <TooltipProvider>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                    <div className="relative w-full h-48">
                        <Image
                            src={blog.image || '/placeholder.svg'}
                            alt={currentTitle}
                            fill
                            className="object-cover"
                        />
                        {blog.section && (
                            <Badge
                                variant="outline"
                                className="absolute top-2 left-2 text-xs bg-white/90 dark:bg-gray-900/90 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 backdrop-blur-sm"
                            >
                                {blog.section}
                            </Badge>
                        )}
                        <Badge
                            variant={languageBadge.variant}
                            className="absolute top-2 right-2 backdrop-blur-sm"
                        >
                            {languageBadge.label}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1 cursor-help">
                                {currentTitle}
                            </h3>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                            <p className="text-sm">{currentTitle}</p>
                        </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 cursor-help">
                                {currentExcerpt}
                            </p>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-sm">
                            <p className="text-sm leading-relaxed">{currentExcerpt}</p>
                        </TooltipContent>
                    </Tooltip>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {blog.author}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {currentReadTime}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <Button asChild className="w-full">
                        <Link href={`/blog/${blog.id}`}>{t('blog.readMore')}</Link>
                    </Button>
                </CardFooter>
            </Card>
        </TooltipProvider>
    )
}
