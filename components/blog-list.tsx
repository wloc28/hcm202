import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Hardcode blog list for admin
const adminblogs = [
  {
    id: 1,
    title: "Triết học về ý nghĩa cuộc sống",
    language: "vietnamese",
    status: "published",
    date: "2024-01-15",
    views: 1250,
  },
  {
    id: 2,
    title: "The Nature of Reality",
    language: "english",
    status: "published",
    date: "2024-01-10",
    views: 890,
  },
  {
    id: 3,
    title: "Dialectics and Social Change",
    language: "english",
    status: "draft",
    date: "2024-01-05",
    views: 0,
  },
]

export function BlogList() {
  const { t } = useLanguage()
  
  const getLanguageBadge = (language: string) => {
    const badges = {
      vietnamese: { label: t('language.vietnamese'), variant: "default" as const },
      english: { label: t('language.english'), variant: "secondary" as const },
    }
    return badges[language as keyof typeof badges] || badges.vietnamese
  }

  const getStatusBadge = (status: string) => {
    return status === "published"
      ? { label: t('blog.published'), variant: "default" as const }
      : { label: t('blog.draft'), variant: "secondary" as const }
  }

  return (
    <div className="space-y-4">
      {adminblogs.map((blog) => {
        const languageBadge = getLanguageBadge(blog.language)
        const statusBadge = getStatusBadge(blog.status)

        return (
          <Card key={blog.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{blog.title}</CardTitle>
                <div className="flex gap-1">
                  <Badge variant={languageBadge.variant} className="text-xs">
                    {languageBadge.label}
                  </Badge>
                  <Badge variant={statusBadge.variant} className="text-xs">
                    {statusBadge.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>{blog.date}</span>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {blog.views} {t('blog.views')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    {t('common.edit')}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-3 w-3 mr-1" />
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
