'use client'

import { ClientOnly } from '@/components/client-only'
import { LanguageSelector } from '@/components/language-selector'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useLanguage } from '@/contexts/language-context'
import { BookOpen, Brain, Home, Menu, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useLanguage()

    const navItems = [
        { href: '/', label: t('nav.home'), icon: Home },
        { href: '/blogs', label: t('nav.blog'), icon: BookOpen },
        { href: '/quiz', label: t('nav.quiz'), icon: Brain },
        { href: '/feedback', label: t('nav.feedback'), icon: MessageSquare },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <BookOpen className="h-6 w-6" />
                        <span className="font-bold text-xl">
                            {t('home.title')}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        <LanguageSelector />

                        <ClientOnly>
                            <ThemeToggle />
                        </ClientOnly>
                    </div>

                    {/* Mobile Navigation */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                            <div className="flex flex-col space-y-4 mt-8">
                                <div className="mb-4">
                                    <LanguageSelector />
                                </div>

                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center space-x-3 text-lg font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">
                                            {t('nav.theme')}
                                        </h3>
                                        <ClientOnly>
                                            <ThemeToggle />
                                        </ClientOnly>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}
