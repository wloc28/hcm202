'use client'

import { CreateVideoForm } from '@/components/create-video-form'
import { VideoList } from '@/components/video-list'
import { useLanguage } from '@/contexts/language-context'

export default function AdminVideosPage() {
    const { t } = useLanguage()

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">
                {t('admin.videos.title')}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        {t('admin.videos.addNew')}
                    </h2>
                    <CreateVideoForm />
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        {t('admin.videos.list')}
                    </h2>
                    <VideoList />
                </div>
            </div>
        </div>
    )
}
