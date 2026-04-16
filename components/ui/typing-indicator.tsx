import type React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex items-center justify-center p-2">
      {/* 👇 [SỬA ĐỔI] Dải màu rộng hơn và background to hơn để chuyển động mượt hơn */}
      <p className="animate-text-gradient bg-gradient-to-r from-red-700 via-red-600 via-rose-500 via-amber-500 to-yellow-300 bg-[400%_auto] bg-clip-text text-transparent">
        HCM202-Learning đang suy ngẫm...
      </p>
    </div>
  );
}