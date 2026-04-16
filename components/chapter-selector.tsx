"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { philosophyBlogs, philosophySections } from "@/data/philosophy-chapters"
import { BookOpen } from "lucide-react"

interface BlogSelectorProps {
  selectedBlog: string
  onBlogChange: (blog: string) => void
  selectedSection: string
  onSectionChange: (section: string) => void
}

export function BlogSelector({
  selectedBlog,
  onBlogChange,
  selectedSection,
  onSectionChange,
}: BlogSelectorProps) {
  const { currentLanguage, getLocalizedContent } = useLanguage()

  const getBlogTitle = (blogId: string) => {
    const blog = philosophyBlogs[blogId as keyof typeof philosophyBlogs]
    return blog ? getLocalizedContent(blog.title) : blogId
  }

  const getSectionTitle = (sectionId: string) => {
    const section = philosophySections[sectionId as keyof typeof philosophySections]
    return section ? getLocalizedContent(section.title) : sectionId
  }

  const getAvailableSections = (blogId: string) => {
    const blog = philosophyBlogs[blogId as keyof typeof philosophyBlogs]
    return blog ? blog.sections : []
  }

  const getSelectAllText = () => {
    switch (currentLanguage) {
      case "english":
        return "All blogs"
      default:
        return "Tất cả chương"
    }
  }

  const getSelectAllSectionsText = () => {
    switch (currentLanguage) {
      case "english":
        return "All sections"
      default:
        return "Tất cả mục"
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="flex items-center gap-2 flex-1">
        <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <Select value={selectedBlog} onValueChange={onBlogChange}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                currentLanguage === "english" ? "Select blog" : "Chọn chương"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{getSelectAllText()}</SelectItem>
            {Object.keys(philosophyBlogs).map((blogId) => (
              <SelectItem key={blogId} value={blogId}>
                {blogId}: {getBlogTitle(blogId)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedBlog !== "all" && (
        <div className="flex-1">
          <Select value={selectedSection} onValueChange={onSectionChange}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  currentLanguage === "english" ? "Select section" : "Chọn mục"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{getSelectAllSectionsText()}</SelectItem>
              {getAvailableSections(selectedBlog).map((sectionId) => (
                <SelectItem key={sectionId} value={sectionId}>
                  {sectionId}: {getSectionTitle(sectionId)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
