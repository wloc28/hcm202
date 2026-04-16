"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { Globe } from "lucide-react"

const languages = {
  vietnamese: { label: "Tiếng Việt", flag: "🇻🇳" },
  english: { label: "English", flag: "🇺🇸" },
}

export function LanguageSelector() {
  const { currentLanguage, setCurrentLanguage, isHydrated } = useLanguage()

  // Show loading state during SSR/hydration
  if (!isHydrated) {
    return (
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <div className="w-40 h-10 bg-gray-100 dark:bg-gray-800 rounded-md" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
        <SelectTrigger className="w-40">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{languages[currentLanguage as keyof typeof languages]?.flag || "🇻🇳"}</span>
              <span className="hidden sm:inline">
                {languages[currentLanguage as keyof typeof languages]?.label || "Tiếng Việt"}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languages).map(([key, lang]) => (
            <SelectItem key={key} value={key}>
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
