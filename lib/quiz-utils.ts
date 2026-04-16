import { blogData } from "@/data/blog-data"
import type { Language } from "@/data/blog-data"
import {
  philosophyBlogs,
  type ChapterId,
  type SectionId,
} from "@/data/philosophy-chapters"
import type { QuizQuestion } from "@/types/quiz"

export const QUIZ_CHUNK_SIZE = 10

export type QuizChunk = {
  partIndex: number
  questions: Record<Language, QuizQuestion[]>
}

export type QuizStatus = "notStarted" | "inProgress" | "completed"

export type QuizOverviewResult = {
  total: number
  score: number
  answered: number
  status: QuizStatus
}

export type StoredQuizPayload = Partial<{
  currentQuestion: number
  score: number
  showResult: boolean
  questionsLength: number
}>

export const getQuizChunksForChapter = (
  chapterId: ChapterId,
): QuizChunk[] => {
  const chapter = philosophyBlogs[chapterId]

  if (!chapter) {
    return []
  }

  const sectionsInChapter = chapter.sections as SectionId[]
  const chapterBlogs = Object.values(blogData).filter((blog) =>
    sectionsInChapter.includes(blog.section),
  )

  const languages: Language[] = ["vietnamese", "english"]
  const questionsMap: Record<Language, QuizQuestion[]> = {
    vietnamese: [],
    english: [],
  }

  chapterBlogs.forEach((blog) => {
    languages.forEach((language) => {
      const questionsForLanguage = blog.quiz?.[language] ?? []
      questionsMap[language] = questionsMap[language].concat(
        questionsForLanguage as QuizQuestion[],
      )
    })
  })

  const maxLength = Math.max(
    ...languages.map((language) => questionsMap[language].length),
  )

  if (maxLength === 0) {
    return []
  }

  const chunkCount = Math.ceil(maxLength / QUIZ_CHUNK_SIZE)

  return Array.from({ length: chunkCount }, (_, index) => {
    const start = index * QUIZ_CHUNK_SIZE
    const end = start + QUIZ_CHUNK_SIZE

    const chunkQuestions = languages.reduce<Record<Language, QuizQuestion[]>>(
      (accumulator, language) => {
        accumulator[language] = questionsMap[language].slice(start, end)
        return accumulator
      },
      { vietnamese: [], english: [] },
    )

    return {
      partIndex: index + 1,
      questions: chunkQuestions,
    }
  })
}

export const getQuizStorageKey = (chapterId: ChapterId, partIndex: number) =>
  `${chapterId}-part-${partIndex}`

export const parseStoredQuizPayload = (
  payload: StoredQuizPayload,
): QuizOverviewResult | null => {
  const total = Math.max(Number(payload.questionsLength) || 0, 0)

  if (total <= 0) {
    return null
  }

  const showResult = Boolean(payload.showResult)
  const maxIndex = Math.max(total - 1, 0)

  const rawCurrent = Number(payload.currentQuestion)
  const sanitizedCurrent = Number.isFinite(rawCurrent)
    ? Math.min(Math.max(rawCurrent, 0), maxIndex)
    : 0

  const answered = showResult ? total : Math.min(sanitizedCurrent, total)

  const rawScore = Number(payload.score)
  const sanitizedScoreBase = Number.isFinite(rawScore) ? rawScore : 0
  const sanitizedScore = Math.min(
    Math.max(sanitizedScoreBase, 0),
    showResult ? total : answered,
  )

  const status: QuizStatus = showResult
    ? "completed"
    : answered > 0 || sanitizedScore > 0
      ? "inProgress"
      : "notStarted"

  return {
    total,
    score: sanitizedScore,
    answered,
    status,
  }
}
