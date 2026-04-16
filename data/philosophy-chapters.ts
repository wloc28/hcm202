// philosophy-chapters.ts (Chapter 6 referenced as Chapter 5, VI/EN)

export const philosophyBlogs = {
  '6': {
    title: {
      vietnamese: 'Chương 5: Tư tưởng hồ chí minh về đại đoàn kết toàn dân tộc và đoàn kết quốc tế',
      english: "Chapter 5: Ho Chi Minh's Thought on Great National Unity and International Solidarity",
    },
    sections: ['6.1', '6.2', '6.3'],
  },
} as const

export type ChapterId = keyof typeof philosophyBlogs

export const philosophySections = {
  '6.1': {
    title: {
      vietnamese: 'Tư tưởng Hồ Chí Minh về đoàn kết dân tộc',
      english: 'Ho Chi Minh’s Thought on National Solidarity',
    },
    blog: '6',
  },
  '6.2': {
    title: {
      vietnamese: 'Tư tưởng Hồ Chí Minh về đoàn kết quốc tế',
      english: 'Ho Chi Minh’s Thought on International Solidarity',
    },
    blog: '6',
  },
  '6.3': {
    title: {
      vietnamese: 'Âm mưu phá hoại và chia rẽ khối đại đoàn kết',
      english: 'Plots to sabotage and divide the great solidarity',
    },
    blog: '6',
  },
} as const

export type SectionId = keyof typeof philosophySections
