'use client'

import { useState, useEffect } from 'react'
import { VideoCard } from '@/components/video-card'
import { useLanguage } from '@/contexts/language-context'

// Define a type for the video data structure for better type safety
interface VideoData {
    id: number
    title: string
    description: string
    thumbnail: string
    duration: string
    youtubeUrl: string
    uploadDate: string
    views: number
}

export default function VideosPage() {
    const { t } = useLanguage()
    const [videos, setVideos] = useState<VideoData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // List of video information including URLs and manual data
        const videoInfoList = [
            {
                id: 1,
                url: 'https://www.youtube.com/watch?v=GHcFwtLn6Xg',
                descriptionKey: 'videos.sampleVideo1Description',
                duration: '15:30',
                uploadDate: '2024-01-15',
                views: 1250,
            },
            {
                id: 2,
                url: 'https://www.youtube.com/watch?v=PZ4VzhIuKCQ',
                descriptionKey: 'videos.sampleVideo2Description',
                duration: '12:45',
                uploadDate: '2024-01-10',
                views: 890,
            },
            {
                id: 3,
                url: 'https://www.youtube.com/watch?v=9B8gJarlbzk',
                descriptionKey: 'videos.sampleVideo3Description',
                duration: '18:20',
                uploadDate: '2024-01-05',
                views: 2100,
            },
        ]

        const fetchVideoDetails = async () => {
            setIsLoading(true)
            try {
                // Create an array of promises to fetch details for all videos concurrently
                const videoDetailsPromises = videoInfoList.map(
                    async (videoInfo) => {
                        // Use a public oEmbed service (noembed.com) to get video metadata without CORS issues or API keys
                        const response = await fetch(
                            `https://noembed.com/embed?url=${encodeURIComponent(
                                videoInfo.url,
                            )}`,
                        )
                        if (!response.ok) {
                            throw new Error(
                                `Failed to fetch data for ${videoInfo.url}`,
                            )
                        }
                        const data = await response.json()

                        // Combine fetched data with manual data
                        return {
                            id: videoInfo.id,
                            title: data.title || 'Untitled Video', // Fetched title
                            description: t(videoInfo.descriptionKey as any), // Manual description from translations
                            thumbnail:
                                data.thumbnail_url ||
                                '/placeholder.svg?height=200&width=350', // Fetched thumbnail
                            duration: videoInfo.duration,
                            youtubeUrl: videoInfo.url,
                            uploadDate: videoInfo.uploadDate,
                            views: videoInfo.views,
                        }
                    },
                )

                // Wait for all fetch requests to complete
                const detailedVideos = await Promise.all(videoDetailsPromises)
                setVideos(detailedVideos as VideoData[])
            } catch (error) {
                console.error('Failed to fetch video details:', error)
                // You could set an error state here to show a message to the user
            } finally {
                setIsLoading(false)
            }
        }

        fetchVideoDetails()
    }, [t]) // Re-run the effect if the language changes to update descriptions

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        {t('videos.title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('videos.description')}
                    </p>
                </div>
            </div>

            {isLoading ? (
                // Display a loading skeleton UI while fetching data
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-muted rounded-lg aspect-video animate-pulse"
                        ></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            )}
        </div>
    )
}
