'use client'

import { useLanguage } from '@/contexts/language-context'
import { philosophyBlogs } from '@/data/philosophy-chapters'
import { BookOpen, Github, Mail, Twitter } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
    const { t, getLocalizedContent } = useLanguage()

    // Get available blogs dynamically
    const availableBlogs = Object.entries(philosophyBlogs)

    return (
        <footer className="bg-gradient-to-r from-red-950 via-red-900 to-red-800 text-red-50 border-t border-red-800/60 mt-16">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4 lg:col-span-1">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-red-600 via-red-500 to-amber-400 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/30">
                                <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-amber-200 via-yellow-200 to-white bg-clip-text text-transparent drop-shadow">
                                {t('home.title')}
                            </span>
                        </div>
                        <p className="text-red-100/80 text-sm leading-relaxed max-w-xs">
                            {t('footer.description')}
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <Link
                                href="#"
                                className="w-9 h-9 rounded-full flex items-center justify-center bg-red-800/60 text-amber-200 shadow-md shadow-red-900/30 transition-all duration-300 hover:bg-red-600 hover:text-yellow-100"
                            >
                                <Mail className="h-4 w-4" />
                            </Link>
                            <Link
                                href="#"
                                className="w-9 h-9 rounded-full flex items-center justify-center bg-red-800/60 text-amber-200 shadow-md shadow-red-900/30 transition-all duration-300 hover:bg-red-600 hover:text-yellow-100"
                            >
                                <Github className="h-4 w-4" />
                            </Link>
                            <Link
                                href="#"
                                className="w-9 h-9 rounded-full flex items-center justify-center bg-red-800/60 text-amber-200 shadow-md shadow-red-900/30 transition-all duration-300 hover:bg-red-600 hover:text-yellow-100"
                            >
                                <Twitter className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-amber-200 text-sm uppercase tracking-wider">
                            {t('footer.quickLinks')}
                        </h3>
                        <div className="space-y-3">
                            <Link
                                href="/blogs"
                                className="block text-red-100/80 hover:text-yellow-100 text-sm transition-all duration-200 hover:translate-x-1"
                            >
                                📚 {t('nav.blog')}
                            </Link>
                            <Link
                                href="/quiz"
                                className="block text-red-100/80 hover:text-yellow-100 text-sm transition-all duration-200 hover:translate-x-1"
                            >
                                🧠 {t('footer.quiz')}
                            </Link>
                            <Link
                                href="/feedback"
                                className="block text-red-100/80 hover:text-yellow-100 text-sm transition-all duration-200 hover:translate-x-1"
                            >
                                💬 {t('nav.feedback')}
                            </Link>
                        </div>
                    </div>

                    {/* Blogs */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-amber-200 text-sm uppercase tracking-wider">
                            {t('footer.blogs')}
                        </h3>
                        <div className="space-y-3">
                            {availableBlogs.map(([blogId, blog]) => {
                                const blogTitle = getLocalizedContent(blog.title)
                                return (
                                    <Link
                                        key={blogId}
                                        href={`/blogs?blog=${blogId}`}
                                        className="block text-red-100/80 hover:text-yellow-100 text-sm transition-all duration-200 hover:translate-x-1"
                                    >
                                        {blogTitle}
                                    </Link>
                                )
                            })}
                            <Link
                                href="/blogs"
                                className="block text-red-100/80 hover:text-yellow-100 text-sm transition-all duration-200 hover:translate-x-1"
                            >
                                📖 {t('footer.allArticles')}
                            </Link>
                            <Link
                                href="/quiz"
                                className="block text-red-100/80 hover:text-yellow-100 text-sm transition-all duration-200 hover:translate-x-1"
                            >
                                🎯 {t('footer.practiceQuiz')}
                            </Link>
                        </div>
                    </div>

                    {/* Resources & Tools */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-amber-200 text-sm uppercase tracking-wider">
                            {t('footer.resourcesTools')}
                        </h3>
                        <div className="space-y-3">
                            <div className="text-red-100/80 text-sm">
                                🤖 {t('footer.aiAssistant')}
                            </div>
                            <div className="text-red-100/80 text-sm">
                                🌐 {t('footer.languageSupport')}
                            </div>
                            <div className="text-red-100/80 text-sm">
                                📊 {t('footer.articlesCount')}
                            </div>
                            <div className="text-red-100/80 text-sm">
                                🎓 {t('footer.interactiveQuiz')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-red-800/60 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-red-100/80">
                            &copy; 2025 {t('home.title')}. {t('footer.rights')}
                        </p>
                        <div className="flex items-center space-x-6 text-xs text-red-100/70">
                            <span>{t('footer.builtWith')}</span>
                            <span>•</span>
                            <span>Next.js 15 + TypeScript</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
