'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/language-context'
import { philosophyBlogs, type ChapterId } from '@/data/philosophy-chapters'
import {
    getQuizChunksForChapter,
    getQuizStorageKey,
    parseStoredQuizPayload,
    type QuizOverviewResult,
    type QuizStatus,
    type StoredQuizPayload,
} from '@/lib/quiz-utils'
import { ArrowRight, Heart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

type LocalizedText = {
    vietnamese: string
    english: string
}

type ChapterCard = {
    chapterId: ChapterId
    icon: LucideIcon
    gradient: string
    border: string
    accent: string
    iconBg: string
    buttonHover: string
    description: LocalizedText
}

type QuizCardDescriptor = ChapterCard & {
    id: string
    partIndex: number
    storageKey: string
    questionsCount: number
    totalParts: number
    href: string
}

const statusColorMap: Record<QuizStatus, string> = {
    completed: 'text-red-600 dark:text-yellow-300',
    inProgress: 'text-amber-600 dark:text-amber-300',
    notStarted: 'text-muted-foreground',
}

const chapterCards: ChapterCard[] = [
    {
        chapterId: '6',
        icon: Heart,
        gradient:
            'from-red-50 via-amber-50 to-white dark:from-red-950/60 dark:via-red-900/40 dark:to-amber-950/30',
        border: 'border-red-200/70 dark:border-red-800/60',
        accent: 'bg-red-600/10',
        iconBg: 'bg-gradient-to-br from-red-700 to-red-500',
        buttonHover:
            'group-hover:bg-gradient-to-r group-hover:from-red-700 group-hover:to-red-500 group-hover:text-yellow-100',
        description: {
            vietnamese:
                'Tìm hiểu về vai trò, lực lượng và nguyên tắc đoàn kết dân tộc, quốc tế cùng các biện pháp chống phá hoại.',
            english:
                'Study the role, forces, and principles of national and international solidarity, along with measures against sabotage.',
        },
    },
]

export default function QuizOverviewPage() {
    const { t, getLocalizedContent } = useLanguage()

    const quizCards = useMemo<QuizCardDescriptor[]>(() => {
        return chapterCards.flatMap((card) => {
            const chunks = getQuizChunksForChapter(card.chapterId)

            if (!chunks.length) {
                return []
            }

            return chunks.map((chunk) => {
                const questionsCount = Math.max(
                    chunk.questions.vietnamese.length,
                    chunk.questions.english.length,
                )
                const storageKey = getQuizStorageKey(
                    card.chapterId,
                    chunk.partIndex,
                )

                return {
                    ...card,
                    id: `${card.chapterId}-part-${chunk.partIndex}`,
                    partIndex: chunk.partIndex,
                    storageKey,
                    questionsCount,
                    totalParts: chunks.length,
                    href: `/quiz/${card.chapterId}/part/${chunk.partIndex}`,
                }
            })
        })
    }, [])

    const [quizResults, setQuizResults] = useState<
        Record<string, QuizOverviewResult>
    >({})

    if (quizCards.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('quiz.noQuizAvailable')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {t('quiz.noQuizQuestionsMessage')}
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const loadStoredResults = useCallback(() => {
        if (typeof window === 'undefined') {
            return
        }

        const next: Record<string, QuizOverviewResult> = {}

        quizCards.forEach(({ storageKey }) => {
            const safeKey = storageKey.replace(/[^a-zA-Z0-9-_]/g, '-')
            const storageKeyName = `quiz-state-${safeKey}`
            const raw = window.localStorage.getItem(storageKeyName)

            if (!raw) {
                return
            }

            try {
                const parsed = JSON.parse(raw) as StoredQuizPayload
                const sanitized = parseStoredQuizPayload(parsed)

                if (!sanitized) {
                    window.localStorage.removeItem(storageKeyName)
                    return
                }

                next[storageKey] = sanitized
            } catch {
                window.localStorage.removeItem(storageKeyName)
            }
        })

        setQuizResults(next)
    }, [quizCards])

    useEffect(() => {
        loadStoredResults()

        if (typeof window === 'undefined') {
            return
        }

        const handleFocus = () => {
            loadStoredResults()
        }

        const handleStorage = () => {
            loadStoredResults()
        }

        window.addEventListener('focus', handleFocus)
        window.addEventListener('storage', handleStorage)

        return () => {
            window.removeEventListener('focus', handleFocus)
            window.removeEventListener('storage', handleStorage)
        }
    }, [loadStoredResults])

    return (
        <div className="container mx-auto px-4 py-8">
            <section className="mt-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {t('quiz.quiz')}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {t('quiz.selectBlogPrompt')}
                    </p>
                </div>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>{t('quiz.recentResultsTitle')}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {t('quiz.recentResultsDescription')}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {quizCards.map((card) => {
                                const chapter = philosophyBlogs[card.chapterId]
                                const result = quizResults[card.storageKey]
                                const status: QuizStatus = result?.status ?? 'notStarted'

                                const statusLabel =
                                    status === 'completed'
                                        ? t('quiz.resultStatusCompleted')
                                        : status === 'inProgress'
                                          ? t('quiz.resultStatusInProgress')
                                          : t('quiz.resultStatusNotStarted')

                                const partSummaryText =
                                    card.totalParts > 1
                                        ? t('quiz.partOfTotal')
                                              .replace(
                                                  '{part}',
                                                  card.partIndex.toString(),
                                              )
                                              .replace(
                                                  '{total}',
                                                  card.totalParts.toString(),
                                              )
                                        : t('quiz.singlePart')

                                let detailText = t('quiz.noAttemptsYet')

                                if (result) {
                                    if (status === 'completed') {
                                        detailText = t('quiz.score')
                                            .replace(
                                                '{score}',
                                                result.score.toString(),
                                            )
                                            .replace(
                                                '{total}',
                                                result.total.toString(),
                                            )
                                    } else if (status === 'inProgress') {
                                        detailText = t('quiz.resultProgressCount')
                                            .replace(
                                                '{answered}',
                                                result.answered.toString(),
                                            )
                                            .replace(
                                                '{total}',
                                                result.total.toString(),
                                            )
                                    } else if (result.total > 0) {
                                        detailText = t('quiz.resultNotStartedHint').replace(
                                            '{total}',
                                            result.total.toString(),
                                        )
                                    }
                                }

                                return (
                                    <div
                                        key={card.id}
                                        className="rounded-xl border border-red-200/70 bg-white/70 p-4 text-left shadow-sm transition-shadow hover:shadow-lg hover:shadow-red-500/20 dark:border-red-800/60 dark:bg-red-950/40"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-red-900 dark:text-yellow-100">
                                                    {getLocalizedContent(chapter.title)}
                                                </p>
                                                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-yellow-300">
                                                    {partSummaryText}
                                                </p>
                                            </div>
                                            <span
                                                className={`text-xs font-semibold uppercase tracking-wide ${statusColorMap[status]}`}
                                            >
                                                {statusLabel}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {detailText}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-red-600/80 dark:text-yellow-200/80">
                                            {t('quiz.questionsInPart').replace(
                                                '{count}',
                                                card.questionsCount.toString(),
                                            )}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                <div
                    className="mt-12 grid grid-cols-1 gap-8 md:[grid-template-columns:repeat(auto-fit,minmax(18rem,1fr))]"
                >
                    {quizCards.map((card) => {
                        const Icon = card.icon
                        const chapter = philosophyBlogs[card.chapterId]
                        const partSummaryText =
                            card.totalParts > 1
                                ? t('quiz.partOfTotal')
                                      .replace('{part}', card.partIndex.toString())
                                      .replace('{total}', card.totalParts.toString())
                                : t('quiz.singlePart')
                        const result = quizResults[card.storageKey]
                        const status: QuizStatus = result?.status ?? 'notStarted'
                        const statusLabel =
                            status === 'completed'
                                ? t('quiz.resultStatusCompleted')
                                : status === 'inProgress'
                                  ? t('quiz.resultStatusInProgress')
                                  : t('quiz.resultStatusNotStarted')
                        const buttonLabel =
                            status === 'completed'
                                ? t('quiz.reviewPartButton')
                                : status === 'inProgress'
                                  ? t('quiz.resumePartButton')
                                  : t('quiz.startPartButton')
                        const targetHref =
                            status === 'completed'
                                ? `${card.href}?mode=review`
                                : status === 'inProgress'
                                  ? `${card.href}?mode=resume`
                                  : card.href
                        let detailText = t('quiz.noAttemptsYet')

                        if (result) {
                            if (status === 'completed') {
                                detailText = t('quiz.score')
                                    .replace('{score}', result.score.toString())
                                    .replace('{total}', result.total.toString())
                            } else if (status === 'inProgress') {
                                detailText = t('quiz.resultProgressCount')
                                    .replace('{answered}', result.answered.toString())
                                    .replace('{total}', result.total.toString())
                            } else if (result.total > 0) {
                                detailText = t('quiz.resultNotStartedHint').replace(
                                    '{total}',
                                    result.total.toString(),
                                )
                            }
                        }

                        return (
                            <div
                                key={card.id}
                                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-8 border ${card.border} shadow-sm transition-all duration-300 hover:shadow-red-500/20 hover:shadow-2xl`}
                            >
                                <div
                                    className={`absolute top-0 right-0 h-32 w-32 ${card.accent} rounded-full -translate-y-16 translate-x-16 opacity-80 blur-2xl transition-transform duration-500 group-hover:scale-150`}
                                ></div>

                                <div className="relative z-10">
                                    <div
                                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${card.iconBg} shadow-lg shadow-red-900/20`}
                                    >
                                        <Icon className="h-6 w-6 text-yellow-100" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-red-900 dark:text-yellow-50">
                                        {getLocalizedContent(chapter.title)}
                                    </h3>
                                    <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-yellow-300">
                                        {partSummaryText}
                                    </p>
                                    <p className="mt-4 text-muted-foreground">
                                        {getLocalizedContent(card.description)}
                                    </p>
                                    <div className="mt-6 flex flex-col gap-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <Button
                                                asChild
                                                className="transition-transform duration-300 group-hover:scale-[1.02]"
                                            >
                                                <Link href={targetHref} className="flex items-center">
                                                    {buttonLabel}
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <span className="text-sm font-medium text-red-700 dark:text-yellow-200">
                                                {t('quiz.questionsInPart').replace(
                                                    '{count}',
                                                    card.questionsCount.toString(),
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between">
                                            <span
                                                className={`font-semibold uppercase tracking-wide ${statusColorMap[status]}`}
                                            >
                                                {statusLabel}
                                            </span>
                                            <span className="text-muted-foreground sm:text-right">
                                                {detailText}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}