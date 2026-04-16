'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useLanguage } from '@/contexts/language-context'
import type { BlogData, BlogId, Language } from '@/data/blog-data'
import { useToast } from '@/hooks/use-toast'
import { Calendar, Clock, Pause, Play, User, Volume2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { Progress } from './ui/progress'

interface BlogReaderProps {
    blog: BlogData[BlogId]
}

// Hàm tiện ích để loại bỏ các ký tự Markdown
const stripMarkdown = (markdownText: string): string => {
    // Loại bỏ tiêu đề Markdown (ví dụ: ## Tiêu đề)
    let cleanedText = markdownText.replace(/#{1,6}\s/g, '')
    // Loại bỏ in đậm/nghiêng (**text**, *text*, _text_)
    cleanedText = cleanedText.replace(/(\*\*|__|\*|_)(.*?)\1/g, '$2')
    // Loại bỏ dấu gạch ngang của list items (ví dụ: - item)
    cleanedText = cleanedText.replace(/-\s/g, '')
    // Loại bỏ các dòng trống thừa
    cleanedText = cleanedText.replace(/\n\s*\n/g, '\n')
    // Thay thế nhiều dấu cách bằng một dấu cách
    cleanedText = cleanedText.replace(/\s+/g, ' ')
    // Cắt bỏ khoảng trắng ở đầu và cuối
    cleanedText = cleanedText.trim()
    return cleanedText
}

export function BlogReader({ blog }: BlogReaderProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [audioLanguage, setAudioLanguage] = useState<Language>(
        blog.originalLanguage as Language
    )
    const { currentLanguage, getLocalizedContent, t, isHydrated } = useLanguage()
    const { toast } = useToast()
    const router = useRouter()
    const articleRef = useRef<HTMLElement>(null)
    const [progress, setProgress] = useState(0)
    const [currentUtterance, setCurrentUtterance] =
        useState<SpeechSynthesisUtterance | null>(null)

    const handleScroll = useCallback(() => {
        if (articleRef.current) {
            const { scrollTop, scrollHeight, clientHeight } =
                document.documentElement || document.body
            const articleElement = articleRef.current
            const articleRect = articleElement.getBoundingClientRect()

            const articleTopRelativeToDoc = articleRect.top + scrollTop
            const articleContentHeight = articleElement.scrollHeight

            const scrolledWithinArticle = Math.max(
                0,
                scrollTop - articleTopRelativeToDoc
            )

            const totalScrollDistanceForArticle =
                articleContentHeight - clientHeight

            let currentProgress = 0
            if (totalScrollDistanceForArticle > 0) {
                currentProgress =
                    (scrolledWithinArticle / totalScrollDistanceForArticle) *
                    100
            } else if (articleContentHeight <= clientHeight) {
                currentProgress =
                    articleRect.top <= 0 && articleRect.bottom >= clientHeight
                        ? 100
                        : 0
            }

            setProgress(Math.min(100, Math.max(0, currentProgress)))
        }
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    useEffect(() => {
        return () => {
            if (currentUtterance) {
                speechSynthesis.cancel()
            }
        }
    }, [currentUtterance])

    const handleTextToSpeech = () => {
        // Kiểm tra xem browser có hỗ trợ Speech Synthesis không
        if (!('speechSynthesis' in window)) {
            toast({
                title: "Lỗi Text-to-Speech",
                description: "Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản.",
                variant: "destructive",
            })
            return
        }

        // Kiểm tra xem Speech Synthesis có sẵn sàng không
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel()
        }

        if (isPlaying && currentUtterance) {
            speechSynthesis.cancel()
            setIsPlaying(false)
            setCurrentUtterance(null)
        } else {
            try {
                const rawContent = blog.content[currentLanguage]
                if (!rawContent || rawContent.trim() === '') {
                    toast({
                        title: "Không có nội dung",
                        description: "Không có nội dung để đọc trong ngôn ngữ hiện tại.",
                        variant: "destructive",
                    })
                    return
                }

                const cleanedContent = stripMarkdown(rawContent)
                
                // Giới hạn độ dài nội dung ngắn hơn để tránh lỗi
                const maxLength = 5000
                const finalContent = cleanedContent.length > maxLength 
                    ? cleanedContent.substring(0, maxLength) + '...'
                    : cleanedContent

                // Đợi một chút để speechSynthesis sẵn sàng
                setTimeout(() => {
                    try {
                        const utterance = new SpeechSynthesisUtterance(finalContent)

                        const languageMap = {
                            vietnamese: 'vi-VN',
                            english: 'en-US',
                        }

                        utterance.lang = languageMap[audioLanguage]
                        utterance.rate = 0.8 // Giảm tốc độ để ổn định hơn
                        utterance.pitch = 1
                        utterance.volume = 0.8

                        utterance.onstart = () => {
                            // Không log để tránh lỗi trong console
                        }

                        utterance.onend = () => {
                            setIsPlaying(false)
                            setCurrentUtterance(null)
                        }

                        utterance.onerror = (event) => {
                            // Không sử dụng console.error để tránh vòng lặp lỗi trong Next.js
                            setIsPlaying(false)
                            setCurrentUtterance(null)
                            
                            // Chỉ hiển thị toast cho người dùng
                            toast({
                                title: "Lỗi Text-to-Speech",
                                description: "Không thể phát âm thanh. Vui lòng thử lại.",
                                variant: "destructive",
                            })
                        }

                        utterance.onpause = () => {
                            // Không log để tránh lỗi
                        }

                        utterance.onresume = () => {
                            // Không log để tránh lỗi
                        }

                        speechSynthesis.speak(utterance)
                        setIsPlaying(true)
                        setCurrentUtterance(utterance)
                        
                    } catch (innerError) {
                        setIsPlaying(false)
                        setCurrentUtterance(null)
                        toast({
                            title: "Lỗi hệ thống",
                            description: "Có lỗi xảy ra khi khởi tạo tính năng đọc văn bản.",
                            variant: "destructive",
                        })
                    }
                }, 100)
                
            } catch (error) {
                // Không sử dụng console.error, chỉ hiển thị toast
                setIsPlaying(false)
                setCurrentUtterance(null)
                toast({
                    title: "Lỗi hệ thống",
                    description: "Có lỗi xảy ra khi chuẩn bị nội dung.",
                    variant: "destructive",
                })
            }
        }
    }

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

    // Hàm riêng để lấy tên ngôn ngữ hiển thị theo currentLanguage
    const getLanguageDisplayName = (language: string) => {
        return t(`language.${language}`)
    }

    const languageBadge = getLanguageBadge(blog.originalLanguage)
    const currentTitle = getLocalizedContent(blog.title)
    const currentContent = getLocalizedContent(blog.content)
    const currentReadTime = getLocalizedContent(blog.readTime)

    // Hiển thị loading state cho đến khi hydration hoàn thành
    if (!isHydrated) {
        return (
            <div className="relative">
                <article className="max-w-6xl mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-muted rounded mb-4"></div>
                        <div className="h-12 bg-muted rounded mb-6"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-muted rounded"></div>
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
                    </div>
                </article>
            </div>
        )
    }

    return (
        <div className="relative">
            {/* Back button */}

            <article ref={articleRef} className="max-w-6xl mx-auto px-4 py-8">
                <header className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Badge variant={languageBadge.variant}>
                            {languageBadge.label}
                        </Badge>
                        <Badge variant="outline">
                            {t('blog.currentlyShowing')}:{' '}
                            {getLanguageBadge(currentLanguage).label}
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-balance animate-fade-in-down">
                        {currentTitle}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-8">
                        <div className="flex items-center gap-1 animate-fade-in">
                            <User className="h-4 w-4" />
                            <span>{blog.author}</span>
                        </div>
                        <div className="flex items-center gap-1 animate-fade-in animation-delay-100">
                            <Calendar className="h-4 w-4" />
                            <span>{blog.date}</span>
                        </div>
                        <div className="flex items-center gap-1 animate-fade-in animation-delay-200">
                            <Clock className="h-4 w-4" />
                            <span>
                                {currentReadTime} {t('blog.readTime')}
                            </span>
                        </div>
                        {blog.originalLanguage && (
                            <div className="flex items-center gap-1 animate-fade-in animation-delay-300">
                                <span className="text-sm font-medium">
                                    {t('blog.contentWillBeRead')}:{' '}
                                    {t(`language.${blog.originalLanguage}`)}
                                </span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main layout for sidebar and content */}
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-12 lg:gap-16 items-start">
                    {/* Sidebar: Text-to-Speech Controls and Progress Bar */}
                    <aside className="md:sticky md:top-28 md:max-h-[calc(100vh-100px)]">
                        <Card className="w-full mb-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Volume2 className="h-5 w-5" />
                                    {t('blog.listenToArticle')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <Select
                                        value={audioLanguage}
                                        onValueChange={(value: Language) =>
                                            setAudioLanguage(value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="vietnamese">
                                                {t(
                                                    'language.vietnameseWithFlag'
                                                )}
                                            </SelectItem>
                                            <SelectItem value="english">
                                                {t('language.englishWithFlag')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={handleTextToSpeech}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        {isPlaying ? (
                                            <>
                                                <Pause className="h-4 w-4 mr-2" />
                                                {t('audio.stop')}
                                            </>
                                        ) : (
                                            <>
                                                <Play className="h-4 w-4 mr-2" />
                                                {t('audio.play')}
                                            </>
                                        )}
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {t('blog.contentWillBeRead')}:{' '}
                                    {getLanguageDisplayName(audioLanguage)}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-secondary/50 rounded-full">
                            <Progress
                                value={progress}
                                className="h-full rounded-full"
                            />
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="prose dark:prose-invert prose-base sm:prose-lg lg:prose-xl mx-auto md:mx-0 py-2 scroll-smooth">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ node, ...props }) => (
                                    <h1
                                        className="text-4xl md:text-5xl font-extrabold text-primary pt-8 pb-4 border-b border-primary/20 mb-8 hover:scale-[1.01] transition-transform duration-200"
                                        {...props}
                                    />
                                ),
                                h2: ({ node, ...props }) => (
                                    <h2
                                        className="text-3xl md:text-4xl font-bold text-secondary-foreground pt-6 pb-3 border-b border-secondary-foreground/10 mb-6 hover:scale-[1.005] transition-transform duration-200"
                                        {...props}
                                    />
                                ),
                                h3: ({ node, ...props }) => (
                                    <h3
                                        className="text-2xl md:text-3xl font-semibold text-tertiary-foreground pt-4 pb-2 mb-4"
                                        {...props}
                                    />
                                ),
                                p: ({ node, ...props }) => {
                                    const isPseudoHeading =
                                        typeof props.children === 'string' &&
                                        (props.children.includes('Khái niệm') ||
                                            props.children.includes(
                                                'Kết luận'
                                            ) ||
                                            /^\d+\.\s/.test(props.children))

                                    if (isPseudoHeading) {
                                        return (
                                            <p
                                                className="text-lg font-bold mt-8 mb-4"
                                                {...props}
                                            />
                                        )
                                    }
                                    return (
                                        <p
                                            className="text-lg leading-relaxed mb-6 text-pretty"
                                            {...props}
                                        />
                                    )
                                },
                                a: ({ node, ...props }) => (
                                    <a
                                        className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        {...props}
                                    />
                                ),
                                ul: ({ node, ...props }) => (
                                    <ul
                                        className="list-disc list-inside space-y-3 mb-6 pl-4"
                                        {...props}
                                    />
                                ),
                                ol: ({ node, ...props }) => (
                                    <ol
                                        className="list-decimal list-inside space-y-3 mb-6 pl-4"
                                        {...props}
                                    />
                                ),
                                li: ({ node, ...props }) => (
                                    <li
                                        className="text-lg leading-relaxed"
                                        {...props}
                                    />
                                ),
                                blockquote: ({ node, ...props }) => (
                                    <blockquote
                                        className="border-l-4 border-primary-500 pl-4 py-2 my-6 italic text-muted-foreground bg-primary/5 rounded-r-lg"
                                        {...props}
                                    />
                                ),
                                code: ({
                                    inline,
                                    className,
                                    children,
                                    ...props
                                }: any) => {
                                    const match = /language-(\w+)/.exec(
                                        className || ''
                                    )
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={materialDark}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(
                                                /\n$/,
                                                ''
                                            )}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code
                                            className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm"
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    )
                                },
                                img: ({ node, ...props }) => (
                                    <img
                                        className="mx-auto my-8 rounded-lg shadow-lg max-w-full h-[400px] object-contain"
                                        {...props}
                                    />
                                ),
                                table: ({ node, ...props }) => (
                                    <div className="overflow-x-auto my-6">
                                        <table
                                            className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden"
                                            {...props}
                                        />
                                    </div>
                                ),
                                th: ({ node, ...props }) => (
                                    <th
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-left font-semibold"
                                        {...props}
                                    />
                                ),
                                td: ({ node, ...props }) => (
                                    <td
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-700"
                                        {...props}
                                    />
                                ),
                            }}
                        >
                            {currentContent}
                        </ReactMarkdown>
                    </div>
                </div>
            </article>
        </div>
    )
}
