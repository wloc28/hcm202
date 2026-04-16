'use client'

import { BlogCard } from '@/components/blog-card'
import Quote from '@/components/quote'
import { RoadmapTimeline } from '@/components/roadmap-timeline'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { blogData } from '@/data/blog-data'
import { roadmapEntries } from '@/data/hcm-roadmap'
import { ArrowRight, BookOpen, Brain, Globe, Heart } from 'lucide-react'
import Link from 'next/link'

// Convert blog data to array format for homepage
const blogList = Object.values(blogData)

const blogs = blogList.slice(0, 3).map((blog) => ({
    id: blog.id,
    section: blog.section,
    title: blog.title,
    excerpt: blog.excerpt,
    author: blog.author,
    date: blog.date,
    readTime: blog.readTime,
    image: blog.image,
    originalLanguage: blog.originalLanguage,
}))

export default function HomePage() {
    const { t } = useLanguage()

    const totalArticles = blogList.length
    const totalQuizQuestions = blogList.reduce((sum, blog) => {
        const questions = (blog as any).quiz?.vietnamese?.length ?? 0
        return sum + questions
    }, 0)

    const chapterArticleCounts = Object.values(blogData).reduce<
        Record<string, number>
    >((acc, blog) => {
        const segments = blog.section.split('.')
        const chapterId = segments[0] || blog.section
        acc[chapterId] = (acc[chapterId] || 0) + 1
        return acc
    }, {})

    const chapterCards = [
        {
            id: '6',
            href: '/blogs?blog=6',
            title: t('home.chapter6Title'),
            description: t('home.chapter6Description'),
            icon: Heart,
            gradient:
                'from-red-50 via-amber-50 to-white dark:from-red-950/50 dark:via-red-900/40 dark:to-amber-950/30',
            border: 'border-red-200/70 dark:border-red-800/60',
            floatingTop: 'from-red-600/25 to-amber-500/20',
            floatingBottom: 'from-amber-500/20 to-red-500/20',
            iconGradient: 'from-red-700 to-amber-500',
            statsBg: 'bg-amber-100/80 dark:bg-red-900/50',
            statsText: 'text-red-700 dark:text-yellow-200',
            titleHover:
                'group-hover:text-red-700 dark:group-hover:text-yellow-200',
            buttonHover:
                'group-hover:bg-gradient-to-r group-hover:from-red-700 group-hover:to-red-500 group-hover:text-yellow-100 group-hover:border-transparent',
            buttonClasses:
                'border-2 border-red-200 text-red-700 hover:text-yellow-100 dark:border-red-600 dark:text-yellow-200',
            shadow: 'hover:shadow-red-500/25 dark:hover:shadow-red-400/30',
        },
    ] as const

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <section className="relative mb-16 overflow-hidden bg-gradient-to-br from-red-950 via-red-800 to-red-600 px-6 py-16 text-center text-white md:px-12 md:py-24 lg:px-16 lg:py-32">
                {/* Enhanced Background Effects - Classic Purple-Blue-Emerald */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-10 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-red-900 via-red-700 to-red-500 opacity-30 blur-3xl"></div>
                    <div className="absolute top-20 right-1/4 h-80 w-80 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 opacity-25 blur-3xl"></div>
                    <div className="absolute -bottom-10 left-1/3 h-72 w-72 rounded-full bg-gradient-to-r from-red-700 via-rose-600 to-amber-500 opacity-20 blur-3xl"></div>
                    <div className="absolute top-1/2 right-1/6 h-64 w-64 rounded-full bg-gradient-to-r from-yellow-500 to-amber-400 opacity-15 blur-3xl"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute inset-0 -z-5 overflow-hidden">
                    <div className="absolute top-20 left-10 h-6 w-6 rounded-full bg-yellow-400/40"></div>
                    <div className="absolute top-40 right-16 h-4 w-4 rounded-full bg-red-400/40"></div>
                    <div className="absolute bottom-32 left-20 h-8 w-8 rounded-full bg-amber-400/35"></div>
                    <div className="absolute top-60 left-1/2 h-5 w-5 rounded-full bg-red-300/35"></div>
                    <div className="absolute bottom-20 right-10 h-7 w-7 rounded-full bg-yellow-300/35"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="animate-fade-in-up">
                        <h1 className="mb-6 text-5xl font-bold text-white drop-shadow-2xl md:text-7xl">
                            {t('home.title')}
                        </h1>
                    </div>
                    <div className="animate-fade-in-up delay-200">
                        <p className="mx-auto mb-4 max-w-3xl text-xl text-red-50/90 md:text-2xl">
                            {t('home.subtitle')}
                        </p>
                    </div>
                    <div className="animate-fade-in-up delay-400">
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-red-50/80">
                            {t('home.heroDescription')}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up delay-600">
                        <Button
                            asChild
                            size="lg"
                            className="text-lg px-8 py-3 shadow-lg shadow-red-900/30 transition-transform duration-300 hover:scale-105 hover:shadow-red-700/40"
                        >
                            <Link href="/blogs">
                                <BookOpen className="mr-2 h-5 w-5" />
                                {t('home.readBlog')}
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg px-8 py-3 border-yellow-300 bg-transparent text-yellow-100 transition-transform duration-300 hover:scale-105 hover:bg-red-600/90 hover:text-yellow-50"
                            asChild
                        >
                            <Link href="/quiz">
                                <Brain className="mr-2 h-5 w-5" />
                                {t('home.takeQuiz')}
                            </Link>
                        </Button>
                    </div>

                    {/* Enhanced Quick Stats */}
                    <div className="flex justify-center space-x-8 text-sm text-red-50/80 animate-fade-in-up delay-800">
                        <div className="group flex cursor-pointer items-center">
                            <div className="mr-2 h-3 w-3 rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-transform group-hover:scale-125"></div>
                            <span className="transition-colors group-hover:text-yellow-100">
                                {totalArticles} {t('home.articlesCount')}
                            </span>
                        </div>
                        <div className="group flex cursor-pointer items-center">
                            <div className="mr-2 h-3 w-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-transform group-hover:scale-125"></div>
                            <span className="transition-colors group-hover:text-yellow-200">2 {t('home.languagesSupported')}</span>
                        </div>
                        <div className="group flex cursor-pointer items-center">
                            <div className="mr-2 h-3 w-3 rounded-full bg-gradient-to-r from-white/80 to-yellow-200/80 transition-transform group-hover:scale-125"></div>
                            <span className="transition-colors group-hover:text-yellow-200">AI Assistant</span>
                        </div>
                    </div>
                </div>
            </section>

            <RoadmapTimeline entries={roadmapEntries} />
            <Quote />
            {/* Blogs Overview */}
            <section className="mt-20">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                        {t('home.exploreBlogs')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {chapterCards.map((card, index) => {
                        const Icon = card.icon
                        const articleCount = chapterArticleCounts[card.id] || 0

                        return (
                            <div
                                key={card.id}
                                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.gradient} p-8 border ${card.border} ${card.shadow} transition-all duration-500 hover:-translate-y-2 animate-fade-in-up`}
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div
                                    className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${card.floatingTop} rounded-full -translate-y-20 translate-x-20 group-hover:scale-150 group-hover:rotate-45 transition-all duration-700`}
                                ></div>
                                <div
                                    className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${card.floatingBottom} rounded-full translate-y-16 -translate-x-16 group-hover:scale-125 group-hover:-rotate-45 transition-all duration-700`}
                                ></div>

                                <div className="relative z-10">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${card.iconGradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3
                                        className={`text-2xl font-bold mb-3 text-red-900 dark:text-yellow-100 transition-colors duration-300 ${card.titleHover}`}
                                    >
                                        {card.title}
                                    </h3>
                                    <p className="mb-6 leading-relaxed text-red-900/70 dark:text-yellow-200/80">
                                        {card.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className={`${card.buttonHover} ${card.buttonClasses} transition-all duration-300 hover:scale-105`}
                                        >
                                            <Link href={card.href}>
                                                {t('home.explore')}{' '}
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                            </Link>
                                        </Button>
                                        <div className={`px-3 py-1 rounded-full ${card.statsBg}`}>
                                            <span className={`text-sm font-medium ${card.statsText}`}>
                                                {articleCount} {t('home.articles')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Featured blogs */}
            <section className="mt-20">
                <div className="flex items-center justify-between mb-12 animate-fade-in-up">
                    <div>
                        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                            {t('home.latestPosts')}
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            {t('home.featuredPostsDescription')}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        asChild
                        className="hidden md:flex bg-gradient-to-r from-red-100/40 via-amber-100/40 to-white/40 border border-red-300 dark:border-red-700 text-red-700 dark:text-amber-200 hover:bg-gradient-to-r hover:from-red-600 hover:via-red-500 hover:to-amber-400 hover:text-yellow-100 transition-all duration-300 hover:scale-105 shadow-sm shadow-red-900/20"
                    >
                        <Link href="/blogs">
                            {t('home.viewAll')}{' '}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <div
                            key={blog.id}
                            className={`transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in-up`}
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-red-700 via-red-600 to-amber-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                                <div className="relative">
                                    <BlogCard blog={blog} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8 md:hidden animate-fade-in-up delay-600">
                    <Button variant="outline" asChild className="bg-gradient-to-r from-red-100/40 via-amber-100/40 to-white/40 border border-red-300 dark:border-red-700 text-red-700 dark:text-amber-200 hover:bg-gradient-to-r hover:from-red-600 hover:via-red-500 hover:to-amber-400 hover:text-yellow-100 transition-all duration-300 shadow-sm shadow-red-900/20">
                        <Link href="/blogs">
                            {t('home.viewAll')}{' '}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Enhanced Stats Section */}
            <section className="mt-20 relative animate-fade-in-up">
                <div className="absolute inset-0 bg-gradient-to-r from-red-700/10 via-red-600/10 to-amber-500/10 dark:from-red-900/20 dark:via-red-800/20 dark:to-amber-800/15 rounded-3xl"></div>
                <div className="relative bg-gradient-to-r from-red-700/15 via-red-600/15 to-amber-500/15 dark:from-red-900/30 dark:via-red-800/25 dark:to-amber-700/25 rounded-3xl p-12 border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm shadow-lg shadow-red-900/20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                            {t('home.statsTitle')}
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            {t('home.statsDescription')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center group animate-fade-in-up delay-200">
                            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-900/40 dark:to-amber-800/30 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-red-700/40">
                                <BookOpen className="h-12 w-12 text-red-600 dark:text-amber-200 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <h3 className="text-5xl font-bold bg-gradient-to-r from-red-700 to-red-500 dark:from-red-400 dark:to-amber-300 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                                {totalArticles}
                            </h3>
                            <p className="text-muted-foreground text-lg font-medium">
                                {t('home.articlesCount')}
                            </p>
                            <p className="text-sm text-muted-foreground/70 mt-2">
                                {t('home.weeklyUpdates')}
                            </p>
                        </div>

                        <div className="text-center group animate-fade-in-up delay-400">
                            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-red-900/40 dark:to-amber-700/35 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-amber-500/40">
                                <Globe className="h-12 w-12 text-amber-600 dark:text-yellow-200 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <h3 className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-amber-300 dark:to-yellow-200 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                                2
                            </h3>
                            <p className="text-muted-foreground text-lg font-medium">
                                {t('home.languagesSupported')}
                            </p>
                            <p className="text-sm text-muted-foreground/70 mt-2">
                                {t('home.languageSupport')}
                            </p>
                        </div>

                        <div className="text-center group animate-fade-in-up delay-600">
                            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-amber-200 dark:from-red-900/40 dark:to-amber-800/35 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-red-700/40">
                                <Brain className="h-12 w-12 text-red-600 dark:text-amber-200 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <h3 className="text-5xl font-bold bg-gradient-to-r from-red-700 to-amber-500 dark:from-red-400 dark:to-amber-300 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                                {totalQuizQuestions}
                            </h3>
                            <p className="text-muted-foreground text-lg font-medium">
                                {t('home.quizQuestions')}
                            </p>
                            <p className="text-sm text-muted-foreground/70 mt-2">
                                {t('home.interactiveQuiz')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
