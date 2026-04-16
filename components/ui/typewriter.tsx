// file: components/ui/typewriter.tsx
'use client'

import { useEffect, useState } from 'react'

interface TypewriterProps {
    text: string;
    speed?: number; // Tốc độ gõ chữ, đơn vị là mili-giây
}

export function Typewriter({ text, speed = 30 }: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState('')

    useEffect(() => {
        setDisplayedText('') // Reset khi text mới được truyền vào

        let i = 0
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i))
                i++
            } else {
                clearInterval(intervalId)
            }
        }, speed)

        // Cleanup function: Dọn dẹp interval khi component bị unmount hoặc text thay đổi
        return () => {
            clearInterval(intervalId)
        }
    }, [text, speed])

    return <>{displayedText}</>
}