import { BlogCardClient } from './blog-card-client'

interface Blog {
    id: number
    title: Record<string, string>
    excerpt: Record<string, string>
    author: string
    date: string
    readTime: Record<string, string>
    image: string
    originalLanguage: string
}

interface BlogCardProps {
    blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
    return <BlogCardClient blog={blog} />
}
