'use client'

import { use, useMemo } from 'react'
import Link from 'next/link'
import { notFound, useSearchParams } from 'next/navigation'

import { Quiz } from '@/components/quiz'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/language-context'
import { philosophyBlogs, type ChapterId } from '@/data/philosophy-chapters'
import { getQuizChunksForChapter, getQuizStorageKey } from '@/lib/quiz-utils'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface QuizPartPageProps {
    params:
        | Promise<{ chapterId: string; partIndex: string }>
        | { chapterId: string; partIndex: string }
}

export default function QuizPartPage({ params }: QuizPartPageProps) {
    const paramsPromise = useMemo(
        () => ('then' in params ? params : Promise.resolve(params)),
        [params],
    )

    const { chapterId, partIndex } = use(paramsPromise)
    const { t, getLocalizedContent, currentLanguage } = useLanguage()
    const searchParams = useSearchParams()

    const typedChapterId = chapterId as ChapterId
    const chapter = philosophyBlogs[typedChapterId]

    if (!chapter) {
        notFound()
    }

    const partNumber = Number(partIndex)

    if (!Number.isFinite(partNumber) || partNumber < 1) {
        notFound()
    }

    const quizChunks = useMemo(
        () => getQuizChunksForChapter(typedChapterId),
        [typedChapterId],
    )

    const chunk = quizChunks[partNumber - 1]

    if (!chunk) {
        notFound()
    }

    const modeParam = searchParams.get('mode')
    const quizMode =
        modeParam === 'review'
            ? 'review'
            : modeParam === 'resume'
              ? 'resume'
              : undefined

    const questionsForLanguage =
        chunk.questions[currentLanguage].length > 0
            ? chunk.questions[currentLanguage]
            : chunk.questions.vietnamese

    if (!questionsForLanguage.length) {
        notFound()
    }

    const totalParts = quizChunks.length
    const chapterTitleLocalized = getLocalizedContent(chapter.title)
    const storageKey = getQuizStorageKey(typedChapterId, chunk.partIndex)
    const questionsCount = questionsForLanguage.length

    const partProgressText = t('quiz.partProgressSummary')
        .replace('{part}', chunk.partIndex.toString())
        .replace('{total}', totalParts.toString())
        .replace('{count}', questionsCount.toString())

    const previousPartHref =
        partNumber > 1 ? `/quiz/${chapterId}/part/${partNumber - 1}` : null
    const nextPartHref =
        partNumber < totalParts
            ? `/quiz/${chapterId}/part/${partNumber + 1}`
            : null

    return (
        <div className="container mx-auto max-w-4xl px-4 py-10">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-red-900 dark:text-yellow-50">
                    {`${t('quiz.quizForChapter')} ${chapterId} – ${chapterTitleLocalized}`}
                </h1>
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-yellow-300">
                    {t('quiz.partLabel')} {chunk.partIndex}
                </p>
                <p className="mt-2 text-muted-foreground">{partProgressText}</p>
            </div>

            <Card className="mt-8 border-red-200/70 bg-white/80 shadow-red-200/60 dark:border-red-800/60 dark:bg-red-950/40">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-red-800 dark:text-yellow-200">
                        {t('quiz.questionsInPart').replace(
                            '{count}',
                            questionsCount.toString(),
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Quiz
                        questions={questionsForLanguage}
                        storageKey={storageKey}
                        mode={quizMode}
                    />
                </CardContent>
            </Card>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                    {previousPartHref ? (
                        <Button asChild variant="outline" className="border-red-500 text-red-700">
                            <Link href={previousPartHref}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t('quiz.previousPart')}
                            </Link>
                        </Button>
                    ) : null}
                    {nextPartHref ? (
                        <Button asChild variant="outline" className="border-red-500 text-red-700">
                            <Link href={nextPartHref}>
                                {t('quiz.nextPart')}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    ) : null}
                </div>
                <div className="flex flex-wrap gap-3 sm:justify-end">
                    <Button asChild variant="ghost" className="text-red-700 hover:text-yellow-100">
                        <Link href={`/quiz/${chapterId}`}>
                            {t('quiz.backToChapterParts')}
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="text-red-700 hover:text-yellow-100">
                        <Link href="/quiz">{t('quiz.backToQuizOverview')}</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
