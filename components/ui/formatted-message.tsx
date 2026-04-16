// file: components/ui/formatted-message.tsx
import type React from 'react';

interface FormattedMessageProps {
    text: string;
}

// Helper function để render inline markdown (chữ đậm và nghiêng)
function renderInline(text: string): React.ReactNode[] {
    // Regex ưu tiênจับคู่ **bold** trước, sau đó mới đến *italic*
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g).filter(part => part);
    return parts.map((part, index) => {
        // Xử lý chữ đậm: **text**
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        // Xử lý chữ nghiêng: *text*
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index}>{part.slice(1, -1)}</em>;
        }
        // Chữ bình thường
        return <span key={index}>{part}</span>;
    });
}

export function FormattedMessage({ text }: FormattedMessageProps) {
    const lines = text.split('\n');

    const messageLines = lines.map((line, index) => {
        // Bỏ qua các dòng trống
        if (line.trim() === '') {
            return <div key={index} className="h-2" />;
        }
        
        const trimmedLine = line.trim();

        // Xử lý tiêu đề cấp 3 (### Title)
        if (trimmedLine.startsWith('### ')) {
            const content = trimmedLine.substring(4);
            return (
                <h3 key={index} className="text-xl font-bold mt-4 mb-2">
                    {renderInline(content)}
                </h3>
            );
        }

        // Xử lý tiêu đề cấp 4 (#### Title)
        if (trimmedLine.startsWith('#### ')) {
            const content = trimmedLine.substring(5);
            return (
                <h4 key={index} className="text-lg font-bold mt-3 mb-1">
                    {renderInline(content)}
                </h4>
            );
        }

        // Xử lý gạch đầu dòng (* item hoặc • item)
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('• ')) {
            const content = trimmedLine.substring(2);
            
            // Tự động xác định độ thụt lề cho danh sách lồng nhau
            const indentation = line.match(/^\s*/)?.[0]?.length ?? 0;
            const indentLevel = Math.floor(indentation / 2); // Giả sử mỗi 2 dấu cách là một cấp
            const indentClass = `pl-${4 + indentLevel * 4}`; // Ví dụ: pl-4, pl-8, pl-12...

            return (
                <div key={index} className={`relative ${indentClass}`}>
                    <span className="absolute left-0 top-0 text-muted-foreground">•</span>
                    <span>{renderInline(content)}</span>
                </div>
            );
        }

        // Dòng bình thường
        return <p key={index}>{renderInline(line)}</p>;
    });

    return <div className="space-y-2">{messageLines}</div>;
}