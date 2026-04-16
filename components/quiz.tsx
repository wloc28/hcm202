"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, RotateCcw, XCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { QuizQuestion } from "@/types/quiz"

type QuizState = {
  currentQuestion: number
  selectedAnswer: string
  showResult: boolean
  answers: (number | null)[]
  storedScore: number | null
}

type QuizMode = "resume" | "review"

interface QuizProps {
  questions: QuizQuestion[]
  storageKey: string
  mode?: QuizMode
}

const createDefaultAnswers = (length: number) =>
  Array.from({ length }, () => null as number | null)

export function Quiz({ questions, storageKey, mode }: QuizProps) {
  const { t } = useLanguage()
  const [state, setState] = useState<QuizState>(() => ({
    currentQuestion: 0,
    selectedAnswer: "",
    showResult: false,
    answers: createDefaultAnswers(questions.length),
    storedScore: null,
  }))

  const hasHydrated = useRef(false)
  const skipNextStorageWrite = useRef(false)
  const previousShowResult = useRef(false)
  const audioStarted = useRef(false)

  const bgmRef = useRef<HTMLAudioElement | null>(null)
  const sfxRef = useRef<HTMLAudioElement | null>(null)

  const storageKeyName = useMemo(() => {
    const safeKey = storageKey.replace(/[^a-zA-Z0-9-_]/g, "-")
    return `quiz-state-${safeKey}`
  }, [storageKey])

  const ensureBgmPlaying = useCallback(() => {
    if (!bgmRef.current) return

    if (!audioStarted.current || bgmRef.current.paused) {
      const playPromise = bgmRef.current.play()
      if (playPromise) {
        playPromise
          .then(() => {
            audioStarted.current = true
          })
          .catch(() => {
            // Autoplay might be blocked; retry on the next user interaction.
          })
      }
    }
  }, [])

  useEffect(() => {
    if (typeof Audio === "undefined") {
      return
    }

    bgmRef.current = new Audio("/assets/quiz-bgm.mp3")
    bgmRef.current.loop = true
    bgmRef.current.volume = 0.4

    sfxRef.current = new Audio("/assets/quiz-result.mp3")
    sfxRef.current.volume = 0.6

    return () => {
      bgmRef.current?.pause()
      bgmRef.current = null
      sfxRef.current = null
    }
  }, [])

  const normalizeAnswers = useCallback(
    (answers: unknown): (number | null)[] => {
      const normalized = createDefaultAnswers(questions.length)

      if (Array.isArray(answers)) {
        answers.forEach((value, index) => {
          if (index < normalized.length) {
            normalized[index] =
              typeof value === "number" && Number.isFinite(value)
                ? value
                : null
          }
        })
      }

      return normalized
    },
    [questions.length],
  )

  const computeScore = useCallback(
    (answers: (number | null)[]) => {
      return answers.reduce((total, answer, index) => {
        if (answer === null) {
          return total
        }

        const question = questions[index]
        if (!question) {
          return total
        }

        return question.correct === answer ? total + 1 : total
      }, 0)
    },
    [questions],
  )

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      const stored = window.localStorage.getItem(storageKeyName)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<
          QuizState & { questionsLength: number; score?: number }
        >

        if (parsed.questionsLength === questions.length) {
          const sanitizedCurrentQuestion = Math.min(
            Math.max(Number(parsed.currentQuestion) || 0, 0),
            Math.max(questions.length - 1, 0),
          )
          const normalizedAnswers = normalizeAnswers(parsed.answers)

          const answeredCount = normalizedAnswers.reduce(
            (total, value) => (value !== null ? total + 1 : total),
            0,
          )
          const rawScore = Number(parsed.score)
          const sanitizedScore = Number.isFinite(rawScore)
            ? Math.min(Math.max(rawScore, 0), questions.length)
            : 0
          const shouldForceReview =
            mode === "review" &&
            (Boolean(parsed.showResult) || answeredCount >= questions.length)

          const sanitizedShowResult = Boolean(parsed.showResult || shouldForceReview)
          const sanitizedSelectedAnswer =
            typeof parsed.selectedAnswer === "string" ? parsed.selectedAnswer : ""

          const effectiveCurrent = sanitizedShowResult
            ? Math.max(questions.length - 1, 0)
            : sanitizedCurrentQuestion
          const fallbackSelected = normalizedAnswers[effectiveCurrent]
          const hydratedSelected = sanitizedShowResult
            ? ""
            : sanitizedSelectedAnswer ||
              (fallbackSelected !== null ? fallbackSelected.toString() : "")

          const answersContainHistory = normalizedAnswers.some(
            (value) => value !== null,
          )

          skipNextStorageWrite.current = true

          setState({
            currentQuestion: effectiveCurrent,
            selectedAnswer: hydratedSelected,
            showResult: sanitizedShowResult,
            answers: normalizedAnswers,
            storedScore: answersContainHistory ? null : sanitizedScore,
          })
          return
        } else if (mode === "review") {
          skipNextStorageWrite.current = true
          setState({
            currentQuestion: Math.max(questions.length - 1, 0),
            selectedAnswer: "",
            showResult: questions.length > 0,
            answers: createDefaultAnswers(questions.length),
            storedScore: Number.isFinite(Number(parsed?.score))
              ? Math.min(Math.max(Number(parsed?.score), 0), questions.length)
              : null,
          })
          return
        } else {
          window.localStorage.removeItem(storageKeyName)
        }
      }
    } catch (error) {
      window.localStorage.removeItem(storageKeyName)
    } finally {
      hasHydrated.current = true
    }
  }, [mode, normalizeAnswers, questions.length, storageKeyName])

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydrated.current) {
      return
    }

    if (skipNextStorageWrite.current) {
      skipNextStorageWrite.current = false
      return
    }

    const payload = {
      ...state,
      score: computeScore(state.answers),
      questionsLength: questions.length,
    }
    window.localStorage.setItem(storageKeyName, JSON.stringify(payload))
  }, [computeScore, questions.length, state, storageKeyName])

  useEffect(() => {
    if (!state.showResult) {
      ensureBgmPlaying()
    } else if (!previousShowResult.current && state.showResult) {
      if (bgmRef.current) {
        bgmRef.current.pause()
      }
      if (sfxRef.current) {
        sfxRef.current.currentTime = 0
        sfxRef.current.play().catch(() => {
          // Ignore playback errors (e.g., autoplay restrictions).
        })
      }
    }

    previousShowResult.current = state.showResult
  }, [ensureBgmPlaying, state.showResult])

  useEffect(() => {
    setState((prev) => {
      const normalizedAnswers = normalizeAnswers(prev.answers)
      const safeCurrent = Math.min(
        prev.currentQuestion,
        Math.max(questions.length - 1, 0),
      )

      const updatedSelected = prev.showResult
        ? ""
        : (() => {
            const existing = normalizedAnswers[safeCurrent]
            return existing !== null ? existing.toString() : prev.selectedAnswer
          })()

      const nextShowResult =
        prev.showResult && questions.length > 0 ? prev.showResult : false

      const answersUnchanged =
        normalizedAnswers.length === prev.answers.length &&
        normalizedAnswers.every((value, index) => value === prev.answers[index])

      if (
        answersUnchanged &&
        safeCurrent === prev.currentQuestion &&
        updatedSelected === prev.selectedAnswer &&
        nextShowResult === prev.showResult
      ) {
        return prev
      }

      return {
        currentQuestion: safeCurrent,
        selectedAnswer: updatedSelected,
        showResult: nextShowResult,
        answers: normalizedAnswers,
        storedScore: prev.storedScore,
      }
    })
  }, [normalizeAnswers, questions.length])

  const getLocalizedText = (path: string) => {
    return t(`quiz.${path}`)
  }

  const handleAnswerSelect = (value: string) => {
    ensureBgmPlaying()
    setState((prev) => ({
      ...prev,
      selectedAnswer: value,
    }))
  }

  const handleSubmitAnswer = () => {
    ensureBgmPlaying()
    setState((prev) => {
      if (prev.selectedAnswer === "") {
        return prev
      }

      const answerIndex = Number.parseInt(prev.selectedAnswer, 10)
      if (Number.isNaN(answerIndex)) {
        return prev
      }

      const currentIndex = Math.min(prev.currentQuestion, Math.max(questions.length - 1, 0))
      const updatedAnswers = normalizeAnswers(prev.answers)
      if (currentIndex < updatedAnswers.length) {
        updatedAnswers[currentIndex] = answerIndex
      }

      const isLastQuestion = currentIndex >= questions.length - 1
      const nextIndex = isLastQuestion ? currentIndex : currentIndex + 1
      const nextSelected = isLastQuestion
        ? ""
        : (() => {
            const stored = updatedAnswers[nextIndex]
            return stored !== null ? stored.toString() : ""
          })()

      return {
        currentQuestion: nextIndex,
        selectedAnswer: nextSelected,
        showResult: isLastQuestion,
        answers: updatedAnswers,
        storedScore: null,
      }
    })
  }

  const resetQuiz = () => {
    skipNextStorageWrite.current = true
    setState({
      currentQuestion: 0,
      selectedAnswer: "",
      showResult: false,
      answers: createDefaultAnswers(questions.length),
      storedScore: null,
    })
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKeyName)
    }
    previousShowResult.current = false

    if (bgmRef.current) {
      bgmRef.current.currentTime = 0
    }
    ensureBgmPlaying()
  }

  const handlePreviousQuestion = () => {
    ensureBgmPlaying()
    setState((prev) => {
      if (prev.currentQuestion <= 0) {
        return prev
      }

      const previousIndex = prev.currentQuestion - 1
      const normalizedAnswers = normalizeAnswers(prev.answers)

      const previousAnswer = normalizedAnswers[previousIndex]

      return {
        currentQuestion: previousIndex,
        selectedAnswer: previousAnswer !== null ? previousAnswer.toString() : "",
        showResult: false,
        answers: normalizedAnswers,
        storedScore: null,
      }
    })
  }

  const score = useMemo(() => {
    const computed = computeScore(state.answers)
    if (state.showResult && computed === 0 && state.storedScore !== null) {
      return state.storedScore
    }
    return computed
  }, [computeScore, state.answers, state.showResult, state.storedScore])
  if (state.showResult) {
    const correctCount = score
    const incorrectCount = Math.max(questions.length - correctCount, 0)

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {correctCount >= questions.length / 2 ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            {getLocalizedText("quizResult")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold mb-2">
              {correctCount}/{questions.length}
            </div>
            <p className="text-muted-foreground">
              {getLocalizedText("score")
                .replace("{score}", correctCount.toString())
                .replace("{total}", questions.length.toString())}
            </p>
            <p className="text-muted-foreground mt-2">
              {getLocalizedText("incorrectCount").replace(
                "{incorrect}",
                incorrectCount.toString(),
              )}
            </p>
          </div>

          <Button onClick={resetQuiz} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            {getLocalizedText("retakeQuiz")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentIndex = Math.min(state.currentQuestion, Math.max(questions.length - 1, 0))
  const currentQuizQuestion = questions[currentIndex]

  if (!currentQuizQuestion) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {getLocalizedText("quiz")} - {getLocalizedText("question")} {currentIndex + 1}/
          {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{currentQuizQuestion.question}</h3>

          <RadioGroup value={state.selectedAnswer} onValueChange={handleAnswerSelect}>
            {currentQuizQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentIndex === 0}
            className="sm:w-1/2"
          >
            {getLocalizedText("previousQuestion")}
          </Button>
          <Button
            type="button"
            onClick={handleSubmitAnswer}
            disabled={state.selectedAnswer === ""}
            className="sm:w-1/2"
          >
            {currentIndex < questions.length - 1
              ? getLocalizedText("nextQuestion")
              : getLocalizedText("complete")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
