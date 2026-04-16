import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/language-context'
import { Edit, Eye, Play, Trash2 } from 'lucide-react'

// Hardcode video list for admin
const adminVideos = [
    {
        id: 1,
        title: 'Triết học Phương Đông vs Phương Tây',
        type: 'youtube',
        duration: '15:30',
        views: 1250,
        date: '2024-01-15',
        status: 'published',
    },
    {
        id: 2,
        title: 'Stoicism in Modern Life',
        type: 'youtube',
        duration: '12:45',
        views: 890,
        date: '2024-01-10',
        status: 'published',
    },
    {
        id: 3,
        title: 'Zen Mind and Modern Stress',
        type: 'local',
        duration: '18:20',
        views: 2100,
        date: '2024-01-05',
        status: 'draft',
    },
]

export function VideoList() {
    const { t } = useLanguage()

    const getTypeBadge = (type: string) => {
        return type === 'youtube'
            ? { label: t('videos.youtube'), variant: 'default' as const }
            : { label: t('videos.local'), variant: 'secondary' as const }
    }

    const getStatusBadge = (status: string) => {
        return status === 'published'
            ? { label: t('videos.published'), variant: 'default' as const }
            : { label: t('videos.draft'), variant: 'secondary' as const }
    }

    return (
        <div className="space-y-4">
            {adminVideos.map((video) => {
                const typeBadge = getTypeBadge(video.type)
                const statusBadge = getStatusBadge(video.status)

                return (
                    <Card key={video.id}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg line-clamp-2">
                                    {video.title}
                                </CardTitle>
                                <div className="flex gap-1">
                                    <Badge
                                        variant={typeBadge.variant}
                                        className="text-xs"
                                    >
                                        {typeBadge.label}
                                    </Badge>
                                    <Badge
                                        variant={statusBadge.variant}
                                        className="text-xs"
                                    >
                                        {statusBadge.label}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <Play className="h-3 w-3" />
                                            {video.duration}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {video.views} {t('videos.views')}
                                        </div>
                                        <span>{video.date}</span>
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
