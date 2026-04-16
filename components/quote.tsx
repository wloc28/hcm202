'use client'

import { useLanguage } from '@/contexts/language-context'

type LocalizedContent = {
  vietnamese: string
  english: string
}

type QuoteItem = {
  text: LocalizedContent
  source: LocalizedContent
}

const quotes: QuoteItem[] = [
  {
    text: {
      vietnamese:
        'Lối sống giản dị, tiết kiệm. Dù là Chủ tịch nước, Bác chỉ ở căn nhà sàn gỗ đơn sơ (1958) bên cạnh Phủ Chủ tịch, ăn uống giản dị: cơm, cá kho, rau luộc, cà muối.',
      english:
        'A life of simplicity and thrift. Even as President, he chose to live in a modest stilt house (1958) beside the Presidential Palace and ate plain meals of rice, braised fish, boiled greens, and pickled eggplant.',
    },
    source: {
      vietnamese:
        'Nguồn: Viện Hồ Chí Minh, Hồ Chí Minh Toàn tập, tập 10, NXB Chính trị quốc gia, 2011.',
      english:
        'Source: Hồ Chí Minh Institute, Hồ Chí Minh Complete Works, vol.10, National Political Publishing House, 2011.',
    },
  },
  {
    text: {
      vietnamese:
        'Không nhận đặc quyền, đặc lợi. Năm 1946, khi Quốc hội quyết định tăng lương cho Chủ tịch nước, Bác từ chối và đề nghị dùng số tiền đó để giúp đồng bào nghèo.',
      english:
        'He refused special privileges. In 1946, when the National Assembly approved a higher salary for the President, he declined it and asked that the money be used to support the poor.',
    },
    source: {
      vietnamese:
        'Nguồn: Trần Dân Tiên, Những mẩu chuyện về đời hoạt động của Hồ Chủ tịch, NXB Sự Thật, 1975.',
      english:
        'Source: Trần Dân Tiên, Stories of President Hồ’s Activities, Truth Publishing House, 1975.',
    },
  },
  {
    text: {
      vietnamese:
        'Chí công vô tư. Có lần Bác Hồ xin Bộ Chính trị mua chiếc máy chữ mới cho công việc, sau đó lại đề nghị trả tiền bằng tiền lương cá nhân vì đó là tài sản riêng, không được dùng công quỹ.',
      english:
        'Absolute selflessness. After requesting a typewriter from the Politburo for work, he insisted on paying for it from his personal salary because it was a private item and public funds should not be used.',
    },
    source: {
      vietnamese:
        'Nguồn: Ban Nghiên cứu Lịch sử Đảng Trung ương, Bác Hồ với những việc làm thường ngày, NXB Sự Thật, 1985.',
      english:
        'Source: Central Party History Research Committee, Hồ Chí Minh in Daily Deeds, Truth Publishing House, 1985.',
    },
  },
  {
    text: {
      vietnamese:
        'Tình thương yêu nhân dân, đặc biệt là thiếu nhi. Mỗi dịp Tết Trung thu, Bác đều gửi thư cho thiếu nhi cả nước. Thư Trung thu năm 1952 Người viết: “Trẻ em như búp trên cành. Biết ăn, biết ngủ, biết học hành là ngoan”.',
      english:
        'Deep love for the people, especially children. Every Mid-Autumn Festival he wrote to children nationwide. In 1952 he reminded them: “Children are like buds on branches. Eating well, sleeping well, and studying well is being good.”',
    },
    source: {
      vietnamese:
        'Nguồn: Hồ Chí Minh Toàn tập, tập 8, NXB Chính trị quốc gia, 2011.',
      english:
        'Source: Hồ Chí Minh Complete Works, vol.8, National Political Publishing House, 2011.',
    },
  },
  {
    text: {
      vietnamese:
        'Tinh thần học tập, lao động. Dù tuổi cao và rất bận rộn, Bác vẫn tự học ngoại ngữ, đọc sách mỗi ngày. Người từng nói: “Học hỏi là một việc phải tiếp tục suốt đời”.',
      english:
        'A relentless spirit of learning and labour. Despite age and duties, he studied foreign languages and read daily, affirming that “studying is a lifelong journey.”',
    },
    source: {
      vietnamese:
        'Nguồn: Hồ Chí Minh Toàn tập, tập 5, NXB Chính trị quốc gia, 2011.',
      english:
        'Source: Hồ Chí Minh Complete Works, vol.5, National Political Publishing House, 2011.',
    },
  },
  {
    text: {
      vietnamese:
        'Gắn bó với nhân dân. Những năm 1941–1945 ở Pác Bó (Cao Bằng), Bác sống trong hang núi, cùng nhân dân ăn măng, uống nước suối, nằm hang đá, chia sẻ khó khăn trong kháng chiến.',
      english:
        'Always close to the people. From 1941 to 1945 in Pác Bó (Cao Bằng), he lived in caves, eating bamboo shoots, drinking spring water, and sharing every hardship of the resistance with the locals.',
    },
    source: {
      vietnamese:
        'Nguồn: Trần Dân Tiên, Những mẩu chuyện về đời hoạt động của Hồ Chủ tịch, NXB Sự Thật, 1975.',
      english:
        'Source: Trần Dân Tiên, Stories of President Hồ’s Activities, Truth Publishing House, 1975.',
    },
  },
]

export default function Quote() {
  const { getLocalizedContent, t } = useLanguage()

  return (
    <section className="bg-gradient-to-br from-red-950 via-red-800 to-red-600 py-16 px-6 text-white">
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-yellow-200 drop-shadow-md">
          {t('home.quoteTitle')}
        </h2>
        <p className="mt-3 text-base text-red-50/80">
          {t('home.quoteSubtitle')}
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {quotes.map((quote, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl border border-red-200/80 bg-white/95 p-6 text-left shadow-lg shadow-red-900/20 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-red-800/60 dark:bg-red-950/60"
          >
            <span className="pointer-events-none absolute -top-6 right-4 select-none text-8xl font-serif text-red-500/20 dark:text-yellow-300/20">
              “
            </span>
            <p className="relative z-10 text-base leading-relaxed text-red-900 dark:text-yellow-50">
              {getLocalizedContent(quote.text)}
            </p>
            <p className="mt-4 border-t border-red-200/60 pt-3 text-sm font-medium text-red-600/80 dark:border-red-800/50 dark:text-yellow-200/80">
              — {getLocalizedContent(quote.source)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
