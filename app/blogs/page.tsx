"use client"

import { BlogCard } from "@/components/blog-card"
import { BlogSelector } from "@/components/chapter-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { blogData } from "@/data/blog-data"
import { BookOpen, Filter, Search, X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
// Import philosophy data for filtering logic
import { philosophyBlogs, type SectionId } from "@/data/philosophy-chapters"

// Convert blog data to array format
const allblogs = Object.values(blogData).map((blog) => ({
  id: blog.id,
  section: blog.section,
  title: blog.title,
  excerpt: blog.excerpt,
  author: blog.author,
  date: blog.date,
  readTime: blog.readTime,
  image: blog.image,
  originalLanguage: blog.originalLanguage,
}));

export default function blogsPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [selectedBlog, setSelectedBlog] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Handle URL parameters on component mount
  useEffect(() => {
    const blogParam = searchParams.get('blog');
    if (blogParam && Object.keys(philosophyBlogs).includes(blogParam)) {
      setSelectedBlog(blogParam);
    }
  }, [searchParams]);

  const handleBlogChange = (blog: string) => {
    setSelectedBlog(blog);
    setSelectedSection("all"); // Reset section when blog changes
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedBlog("all");
    setSelectedSection("all");
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== "" || selectedBlog !== "all";

  // Logic lọc blog dựa trên chương, mục và từ khóa tìm kiếm
  const filteredblogs = allblogs.filter(blog => {
    // 1. Lọc theo từ khóa tìm kiếm (trên tiêu đề và tóm tắt tiếng Việt)
    const matchesSearch =
      blog.title.vietnamese.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.vietnamese.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Lọc theo chương và mục
    let matchesBlogAndSection = true;

    if (selectedBlog !== "all") { // Nếu có chương được chọn
      // Ensure selectedBlog is a valid BlogId for indexing philosophyBlogs
      const blogKey = selectedBlog as keyof typeof philosophyBlogs; //
      const blogSections = philosophyBlogs[blogKey]?.sections; //

      if (blogSections) {
        // Use readonly array type assertion to match the actual type from philosophyBlogs
        matchesBlogAndSection = (blogSections as readonly SectionId[]).includes(blog.section as SectionId);

        if (selectedSection !== "all") { // Nếu có cả mục con được chọn
          // Ensure selectedSection is a valid SectionId for comparison
          matchesBlogAndSection = matchesBlogAndSection && blog.section === (selectedSection as SectionId);
        }
      } else {
        // Nếu chương không tồn tại trong philosophyBlogs, không khớp
        matchesBlogAndSection = false;
      }
    }

    return matchesSearch && matchesBlogAndSection;
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50/40 to-white dark:from-red-950 dark:via-red-900/60 dark:to-amber-950/30">
      <div className="container mx-auto px-4 py-6">
        {/* Enhanced Header Section */}
        <div className="relative mb-8 text-center">
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-red-600/20 via-red-500/20 to-amber-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute top-10 right-1/3 w-24 h-24 bg-gradient-to-r from-red-400/15 to-yellow-300/15 rounded-full blur-xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-100/80 via-amber-100/80 to-white/80 dark:from-red-950/40 dark:via-red-900/30 dark:to-amber-900/30 rounded-full border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm mb-4">
              <BookOpen className="h-5 w-5 text-red-600 dark:text-amber-300" />
              <span className="text-sm font-medium text-red-700 dark:text-amber-200">
                {filteredblogs.length} {t('blogPage.articlesAvailable')}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-700 via-red-600 to-amber-500 dark:from-red-400 dark:via-red-300 dark:to-amber-300 bg-clip-text text-transparent animate-gradient">
              {t('blogPage.heroTitle')}
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
              {t('blogPage.heroDescription')}
            </p>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="relative mb-8">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-amber-50/50 to-red-50/40 dark:from-red-950/70 dark:via-red-900/50 dark:to-amber-950/40 rounded-3xl blur-xl"></div>

          <div className="relative bg-white/85 dark:bg-red-950/80 backdrop-blur-sm rounded-3xl p-6 border border-red-200/50 dark:border-red-800/50 shadow-lg shadow-red-900/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-red-700 via-red-600 to-amber-500 rounded-xl shadow-lg shadow-red-900/30">
                <Filter className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-amber-500 dark:from-red-400 dark:via-red-300 dark:to-amber-200 bg-clip-text text-transparent">
                {t('blogPage.filterAndSearch')}
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {/* Enhanced Search Input */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-700 via-red-600 to-amber-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-focus-within:text-red-500" />
                  <Input
                    placeholder={t('blogPage.searchPlaceholder')}
                    className="pl-12 pr-4 py-2.5 text-base bg-white dark:bg-red-950/70 border-2 border-red-100/80 dark:border-red-800/60 rounded-xl transition-all duration-300 focus:border-red-500 dark:focus:border-amber-400 focus:shadow-lg focus:shadow-red-500/25"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              {/* Enhanced Filter Row - Blog, Section & Clear on same row */}
              <div className="bg-gradient-to-r from-white/60 to-amber-50/50 dark:from-red-950/50 dark:to-red-900/40 rounded-2xl p-4 border border-red-200/40 dark:border-red-800/50">
                <div className="flex items-center gap-4 w-full">
                  {/* Blog Selector - Takes most space */}
                  <div className="flex-1">
                    <BlogSelector
                      selectedBlog={selectedBlog}
                      onBlogChange={handleBlogChange}
                      selectedSection={selectedSection}
                      onSectionChange={handleSectionChange}
                    />
                  </div>
                  
                  {/* Clear Filters Button - Fixed width */}
                  {hasActiveFilters && (
                    <div className="flex-shrink-0">
                      <Button
                        onClick={clearAllFilters}
                        variant="outline"
                        size="sm"
                        className="group relative overflow-hidden border-red-300 hover:border-red-400 dark:border-red-800 dark:hover:border-red-700 text-red-700 hover:text-yellow-100 dark:text-amber-200 dark:hover:text-yellow-100 whitespace-nowrap"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 to-amber-100/50 dark:from-red-950/30 dark:to-amber-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-2">
                          <X className="h-3 w-3" />
                          <span className="text-xs font-medium">{t('blogPage.clearAll')}</span>
                        </div>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {(searchTerm || selectedBlog !== "all") && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100/80 to-amber-100/80 dark:from-red-950/40 dark:to-amber-900/30 rounded-full border border-red-200/50 dark:border-red-800/50">
              <span className="text-red-700 dark:text-amber-200 font-medium">
                {filteredblogs.length === 0
                  ? t('blogPage.noResults')
                  : `${filteredblogs.length} ${t('blogPage.resultsFound')}`
                }
              </span>
            </div>
          </div>
        )}

        {/* Enhanced Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredblogs.map((blog, index) => (
            <div
              key={blog.id}
              className="group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
  style={{
    animationName: 'fadeInUp',
    animationDuration: '0.6s',
    animationTimingFunction: 'ease-out',
    animationFillMode: 'forwards',
    animationDelay: `${index * 100}ms`,
  }}
            >
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-700/20 via-red-600/20 to-amber-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative">
                <BlogCard blog={blog} />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredblogs.length === 0 && (
          <div className="text-center py-12">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-red-200/50 to-amber-200/50 dark:from-red-900/40 dark:to-amber-900/40 rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10">
                <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-muted-foreground mb-2">
                  {t('blog.noArticlesFound')}
                </h3>
                <p className="text-muted-foreground/70 max-w-md mx-auto">
                  {t('blog.tryDifferentFilters')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}