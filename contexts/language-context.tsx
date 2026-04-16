'use client'

import { translations } from '@/data/translations'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
type Language = 'vietnamese' | 'english'

interface LanguageContextType {
    currentLanguage: Language
    setCurrentLanguage: (language: Language) => void
    getLocalizedContent: (content: Record<Language, string>) => string
    t: (path: string) => string
    isHydrated: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [currentLanguage, setCurrentLanguage] =
        useState<Language>('vietnamese')
    const [isHydrated, setIsHydrated] = useState(false)

    const getTranslation = (path: string): string => {
        const keys = path.split('.')
        let value: any = translations

        for (const key of keys) {
            value = value?.[key]
            if (!value) return path
        }

        return value[currentLanguage] || value.vietnamese || path
    }

    // Load saved language from localStorage after hydration
    useEffect(() => {
        const savedLanguage = localStorage.getItem(
            'preferred-language'
        ) as Language
        if (savedLanguage && ['vietnamese', 'english'].includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage)
        }
        setIsHydrated(true)
    }, [])

    // Save language to localStorage when changed
    const handleSetLanguage = (language: Language) => {
        setCurrentLanguage(language)
        localStorage.setItem('preferred-language', language)
    }

    const getLocalizedContent = (content: Record<Language, string>) => {
        return (
            content[currentLanguage] ||
            content.vietnamese ||
            Object.values(content)[0]
        )
    }

    return (
        <LanguageContext.Provider
            value={{
                currentLanguage,
                setCurrentLanguage: handleSetLanguage,
                getLocalizedContent,
                t: getTranslation,
                isHydrated,
            }}
        >
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
