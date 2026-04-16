'use client'

import { use, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/language-context'
import {
    philosophyBlogs,
    type ChapterId,
} from '@/data/philosophy-chapters'
import {
    getQuizChunksForChapter,
    getQuizStorageKey,
    parseStoredQuizPayload,
    type QuizOverviewResult,
    type QuizStatus,
    type StoredQuizPayload,
} from '@/lib/quiz-utils'
import { ArrowRight } from 'lucide-react'

interface QuizPageProps {
    params: Promise<{ chapterId: string }> | { chapterId: string }
}

export default function QuizChapterPage({ params }: QuizPageProps) {
    const paramsPromise = useMemo(
        () => ('then' in params ? params : Promise.resolve(params)),
        [params],
    )

    const { chapterId } = use(paramsPromise)
    const { t, getLocalizedContent } = useLanguage()

    const typedChapterId = chapterId as ChapterId
    const chapter = philosophyBlogs[typedChapterId]

    if (!chapter) {
        notFound()
    }

    const quizChunks = useMemo(
        () => getQuizChunksForChapter(typedChapterId),
        [typedChapterId],
    )

    if (!quizChunks.length) {
        return (
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <Card className="border-red-200/70 dark:border-red-800/60">
                    <CardHeader>
                        <CardTitle className="text-red-800 dark:text-yellow-200">
                            {t('quiz.noQuizAvailable')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {t('quiz.noQuizQuestionsMessage')}
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="/quiz">{t('quiz.backToQuizOverview')}</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const totalParts = quizChunks.length
    const chapterTitleLocalized = getLocalizedContent(chapter.title)
    const partCards = useMemo(
        () =>
            quizChunks.map((chunk) => ({
                partIndex: chunk.partIndex,
                questionsCount: Math.max(
                    chunk.questions.vietnamese.length,
                    chunk.questions.english.length,
                ),
                href: `/quiz/${chapterId}/part/${chunk.partIndex}`,
                storageKey: getQuizStorageKey(typedChapterId, chunk.partIndex),
            })),
        [chapterId, quizChunks, typedChapterId],
    )

    const [quizResults, setQuizResults] = useState<
        Record<string, QuizOverviewResult>
    >({})

    const loadStoredResults = useCallback(() => {
        if (typeof window === 'undefined') {
            return
        }

        const next: Record<string, QuizOverviewResult> = {}

        partCards.forEach(({ storageKey }) => {
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
    }, [partCards])

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

    const statusColorMap: Record<QuizStatus, string> = {
        completed: 'text-red-600 dark:text-yellow-300',
        inProgress: 'text-amber-600 dark:text-amber-300',
        notStarted: 'text-muted-foreground',
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-10">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-red-900 dark:text-yellow-50">
                    {`${t('quiz.quizForChapter')} ${chapterId} – ${chapterTitleLocalized}`}
                </h1>
                <p className="mt-4 text-muted-foreground">
                    {t('quiz.partSelectionIntro').replace(
                        '{total}',
                        totalParts.toString(),
                    )}
                </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                {partCards.map((part) => {
                    const result = quizResults[part.storageKey]
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
                            ? `${part.href}?mode=review`
                            : status === 'inProgress'
                              ? `${part.href}?mode=resume`
                              : part.href

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
                        <Card
                            key={part.partIndex}
                            className="border-red-200/70 bg-white/80 shadow-red-200/60 dark:border-red-800/60 dark:bg-red-950/40"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-xl font-semibold text-red-800 dark:text-yellow-200">
                                            {`${t('quiz.partLabel')} ${part.partIndex}`}
                                        </CardTitle>
                                        <p className="text-sm font-medium text-red-600/80 dark:text-yellow-300/80">
                                            {t('quiz.partOfTotal')
                                                .replace('{part}', part.partIndex.toString())
                                                .replace('{total}', totalParts.toString())}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {t('quiz.questionsInPart').replace(
                                                '{count}',
                                                part.questionsCount.toString(),
                                            )}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-xs font-semibold uppercase tracking-wide ${statusColorMap[status]}`}
                                    >
                                        {statusLabel}
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">{detailText}</p>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between gap-3">
                                <Button asChild className="flex-1">
                                    <Link
                                        href={targetHref}
                                        className="flex items-center justify-center"
                                    >
                                        {buttonLabel}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="mt-8 text-center">
                <Button asChild variant="outline" className="border-red-500 text-red-700">
                    <Link href="/quiz">{t('quiz.backToQuizOverview')}</Link>
                </Button>
            </div>
        </div>
    )
}
