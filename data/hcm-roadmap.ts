export type RoadmapEntry = {
    id: string
    stage: {
        vietnamese: string
        english: string
    }
    period: {
        vietnamese: string
        english: string
    }
    event: {
        vietnamese: string
        english: string
    }
    significance: {
        vietnamese: string
        english: string
    }
}

export const roadmapEntries: RoadmapEntry[] = [
    {
        id: '1890-birth',
        stage: {
            vietnamese: 'Thời ấu thơ & nguồn cảm hứng ban đầu',
            english: 'Childhood & early inspirations',
        },
        period: { vietnamese: '1890 (19/5)', english: '1890 (May 19)' },
        event: {
            vietnamese:
                'Sinh ra tại làng Kim Liên, xã Nam Liên, huyện Nam Đàn, tỉnh Nghệ An với tên khai sinh Nguyễn Sinh Cung. ![1890](/assets/roadmap-images/1890.jpg)'
                ,
            english:
                'Born in Kim Liên village, Nam Liên commune, Nam Đàn district, Nghệ An Province; birth name Nguyễn Sinh Cung. ![1890](/assets/roadmap-images/1890.jpg)',
        },
        significance: {
            vietnamese:
                'Gia đình có truyền thống yêu nước, sống dưới ách đô hộ Pháp – bối cảnh hình thành nhận thức ban đầu về áp bức và bất công.',
            english:
                'Raised in a patriotic family under French colonial rule, shaping his first awareness of oppression and injustice.',
        },
    },
    {
        id: '1901-quoc-hoc',
        stage: {
            vietnamese: 'Thời ấu thơ & nguồn cảm hứng ban đầu',
            english: 'Childhood & early inspirations',
        },
        period: {
            vietnamese: '1901 – đầu thập niên 1900',
            english: '1901 – early 1900s',
        },
        event: {
            vietnamese:
                'Bắt đầu dùng tên Nguyễn Tất Thành khi theo học tại Trường Quốc học Huế. ![1901](/assets/roadmap-images/1901.webp)',
            english:
                'Adopted the name Nguyễn Tất Thành while studying at Quốc Học Huế. ![1901](/assets/roadmap-images/1901.webp)',
        },
        significance: {
            vietnamese:
                'Thể hiện ý chí học hỏi, hình thành sớm ý thức dân tộc và khát vọng vươn lên.',
            english:
                'Showed a hunger for learning and an early sense of national consciousness and aspiration.',
        },
    },
    {
        id: '1911-departure',
        stage: {
            vietnamese: 'Giai đoạn ra đi tìm đường cứu nước',
            english: 'Journey to find a path to national liberation',
        },
        period: { vietnamese: '05/6/1911', english: '5 June 1911' },
        event: {
            vietnamese:
                'Rời cảng Nhà Rồng (Sài Gòn), lên tàu Đô đốc Latouche-Tréville với tên hiệu “Văn Ba”, bắt đầu hành trình bôn ba tìm đường cứu nước. ![1911](/assets/roadmap-images/1911.webp)',
            english:
                'Left Nhà Rồng wharf (Saigon) aboard the Latouche-Tréville under the alias “Văn Ba,” beginning his quest abroad for national salvation. ![1911](/assets/roadmap-images/1911.webp)',
        },
        significance: {
            vietnamese:
                'Bước ngoặt quyết định – từ trong nước bước ra thế giới để tìm đường giải phóng dân tộc.',
            english:
                'A decisive turning point, stepping onto the world stage to discover a strategy for liberating Vietnam.',
        },
    },
    {
        id: '1911-1920-work',
        stage: {
            vietnamese: 'Giai đoạn ra đi tìm đường cứu nước',
            english: 'Journey to find a path to national liberation',
        },
        period: { vietnamese: '1911 – 1920', english: '1911 – 1920' },
        event: {
            vietnamese:
                'Làm việc, sinh sống tại Pháp, Anh, Mỹ, châu Phi, châu Á; tiếp xúc phong trào công nhân và phong trào giải phóng dân tộc. ![1911-1920](/assets/roadmap-images/1920.webp)',
            english:
                'Worked and lived in France, Britain, the United States, Africa, and Asia, engaging with labour and anti-colonial movements. ![1911-1920](/assets/roadmap-images/1920.webp)',
        },
        significance: {
            vietnamese:
                'Trải nghiệm thực tiễn giúp thấm nhuần quyền lợi người lao động và sức mạnh quốc tế của cách mạng thuộc địa.',
            english:
                'These lived experiences deepened his understanding of workers’ rights and the global power of colonial liberation movements.',
        },
    },
    {
        id: '1919-petition',
        stage: {
            vietnamese: 'Giai đoạn ra đi tìm đường cứu nước',
            english: 'Journey to find a path to national liberation',
        },
        period: { vietnamese: '1919', english: '1919' },
        event: {
            vietnamese:
                'Dưới tên Nguyễn Ái Quốc, gửi “Yêu sách của nhân dân An Nam” tới Hội nghị Versailles, yêu cầu quyền tự do, dân chủ cho Việt Nam. ![1919](/assets/roadmap-images/1919.webp)',
            english:
                'As Nguyễn Ái Quốc, submitted the “Claims of the Annamite People” to the Versailles Conference, demanding freedom and democracy for Vietnam. ![1919](/assets/roadmap-images/1919.webp)',
        },
        significance: {
            vietnamese:
                'Đánh dấu bước chuyển từ hoạt động cá nhân sang đấu tranh chính trị trên trường quốc tế.',
            english:
                'Marked a shift from personal activism to international political advocacy for Vietnam.',
        },
    },
    {
        id: '1920-1930-communist',
        stage: {
            vietnamese: 'Giai đoạn ra đi tìm đường cứu nước',
            english: 'Journey to find a path to national liberation',
        },
        period: { vietnamese: '1920 – 1930', english: '1920 – 1930' },
        event: {
            vietnamese:
                'Tham gia các tổ chức cộng sản tại Pháp, tiến tới chuẩn bị cho việc thành lập Đảng Cộng sản ở Việt Nam. ![1920-1930](/assets/roadmap-images/1920.webp)',
            english:
                'Joined communist organisations in France and prepared for the creation of the Communist Party in Vietnam. ![1920-1930](/assets/roadmap-images/1920.webp)',
        },
        significance: {
            vietnamese:
                'Hoàn thiện lý luận cách mạng, kết nối phong trào cách mạng thế giới với Việt Nam.',
            english:
                'Consolidated revolutionary theory and linked Vietnam’s struggle with global movements.',
        },
    },
    {
        id: '1930-founding',
        stage: {
            vietnamese: 'Thành lập Đảng và lãnh đạo cách mạng trong nước',
            english: 'Founding the Party & leading the domestic revolution',
        },
        period: { vietnamese: '03/02/1930', english: '3 February 1930' },
        event: {
            vietnamese:
                'Chủ trì Hội nghị hợp nhất ba tổ chức cộng sản và thành lập Đảng Cộng sản Việt Nam tại Quảng Châu (Trung Quốc). ![1930](/assets/roadmap-images/1930.jpg)',
            english:
                'Presided over the conference unifying three communist organisations to found the Communist Party of Vietnam in Guangzhou, China. ![1930](/assets/roadmap-images/1930.jpg)',
        },
        significance: {
            vietnamese:
                'Xác lập vai trò lãnh đạo của Đảng đối với cách mạng Việt Nam.',
            english:
                'Established the Party’s leadership role over Vietnam’s revolution.',
        },
    },
    {
        id: '1941-pac-bo',
        stage: {
            vietnamese: 'Thành lập Đảng và lãnh đạo cách mạng trong nước',
            english: 'Founding the Party & leading the domestic revolution',
        },
        period: { vietnamese: '08/2/1941', english: '8 February 1941' },
        event: {
            vietnamese:
                'Bí mật về nước, đến Pắc Bó (Cao Bằng) để trực tiếp lãnh đạo phong trào Việt Minh. ![1941](/assets/roadmap-images/1941.jpg)',
            english:
                'Secretly returned to Vietnam, arriving in Pác Bó (Cao Bằng) to directly lead the Việt Minh movement. ![1941](/assets/roadmap-images/1941.jpg)',
        },
        significance: {
            vietnamese:
                'Chuyển sang lãnh đạo thực tiễn trên quê hương, xây dựng lực lượng kháng chiến.',
            english:
                'Signalled hands-on leadership within Vietnam and the organisation of resistance forces.',
        },
    },
    {
        id: '1945-august-revolution',
        stage: {
            vietnamese: 'Cách mạng Tháng Tám & nắm quyền lãnh đạo nhà nước',
            english: 'August Revolution & leading the new state',
        },
        period: { vietnamese: '19/8/1945', english: '19 August 1945' },
        event: {
            vietnamese: 'Tổng khởi nghĩa giành chính quyền ở Hà Nội và trên cả nước. ![1945](/assets/roadmap-images/1945.jpg)',
            english:
                'Led the general uprising to seize power in Hà Nội and nationwide. ![1945](/assets/roadmap-images/1945.jpg)',
        },
        significance: {
            vietnamese:
                'Thắng lợi cách mạng dân tộc, chấm dứt ách thống trị thực dân.',
            english:
                'Achieved national revolutionary victory, ending colonial rule.',
        },
    },
    {
        id: '1945-independence',
        stage: {
            vietnamese: 'Cách mạng Tháng Tám & nắm quyền lãnh đạo nhà nước',
            english: 'August Revolution & leading the new state',
        },
        period: { vietnamese: '02/9/1945', english: '2 September 1945' },
        event: {
            vietnamese:
                'Đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa. ![2-9-1945](/assets/roadmap-images/2-9-1945.jpg)',
            english:
                'Proclaimed the Declaration of Independence, founding the Democratic Republic of Vietnam. ![2-9-1945](/assets/roadmap-images/2-9-1945.jpg)',
        },
        significance: {
            vietnamese:
                `Biểu tượng quốc gia độc lập, đặt nền tảng cho nhà nước mới.`,
            english:
                'Symbolised an independent nation and laid the foundation for the new state.',
        },
    },
    {
        id: '1946-president',
        stage: {
            vietnamese: 'Cách mạng Tháng Tám & nắm quyền lãnh đạo nhà nước',
            english: 'August Revolution & leading the new state',
        },
        period: { vietnamese: '1946', english: '1946' },
        event: {
            vietnamese:
                'Quốc hội khóa I bầu Hồ Chí Minh làm Chủ tịch nước và đảm nhiệm vai trò Thủ tướng giai đoạn đầu. ![1946](/assets/roadmap-images/1946.jpg)',
            english:
                'The First National Assembly elected him President; he also served as Prime Minister in the early years. ![1946](/assets/roadmap-images/1946.jpg)',
        },
        significance: {
            vietnamese:
                'Dựng nền móng nhà nước cách mạng, tổ chức bộ máy chính quyền từ trung ương đến địa phương.',
            english:
                'Built the foundations of the revolutionary state and organised government from central to local levels.',
        },
    },
    {
        id: '1946-1954-war',
        stage: {
            vietnamese: 'Kháng chiến chống Pháp & xây dựng miền Bắc',
            english: 'Resistance against the French & building the North',
        },
        period: { vietnamese: '1946 – 1954', english: '1946 – 1954' },
        event: {
            vietnamese:
                'Lãnh đạo cuộc kháng chiến toàn quốc chống thực dân Pháp, đỉnh cao là chiến thắng Điện Biên Phủ và Hiệp định Genève. ![1946-1954](/assets/roadmap-images/1946-1954.jpg)',
            english:
                'Led the nationwide resistance against French colonialism, culminating in Điện Biên Phủ victory and the Geneva Accords. ![1946-1954](/assets/roadmap-images/1946-1954.jpg)',
        },
        significance: {
            vietnamese:
                'Chấm dứt ách thống trị của Pháp tại Đông Dương, dù đất nước tạm thời bị chia cắt.',
            english:
                'Ended French domination in Indochina, though Vietnam was temporarily divided.',
        },
    },
    {
        id: '1955-1960-reform',
        stage: {
            vietnamese: 'Kháng chiến chống Pháp & xây dựng miền Bắc',
            english: 'Resistance against the French & building the North',
        },
        period: { vietnamese: '1955 – 1960', english: '1955 – 1960' },
        event: {
            vietnamese:
                'Miền Bắc tiến hành cách mạng xã hội chủ nghĩa: cải cách ruộng đất, hợp tác hóa nông nghiệp, xây dựng công nghiệp. ![1955-1960](/assets/roadmap-images/1955-1960.jpg)',
            english:
                'The North advanced socialist transformation: land reform, agricultural collectivisation, and industrial development. ![1955-1960](/assets/roadmap-images/1955-1960.jpg)',
        },
        significance: {
            vietnamese:
                'Thử nghiệm mô hình xã hội chủ nghĩa, tạo nền tảng kinh tế – xã hội mới.',
            english:
                'Tested the socialist model and laid new socio-economic foundations.',
        },
    },
    {
        id: '1951-congress-ii',
        stage: {
            vietnamese: 'Kháng chiến chống Pháp & xây dựng miền Bắc',
            english: 'Resistance against the French & building the North',
        },
        period: { vietnamese: '1951', english: '1951' },
        event: {
            vietnamese:
                'Đại hội lần II của Đảng bầu Hồ Chí Minh làm Chủ tịch Ban Chấp hành Trung ương. ![1951](/assets/roadmap-images/1951.jpg)',
            english:
                'The Party’s Second Congress elected him Chairman of the Central Committee. ![1951](/assets/roadmap-images/1951.jpg)',
        },
        significance: {
            vietnamese:
                'Củng cố vai trò lãnh đạo cá nhân và kiện toàn tổ chức Đảng.',
            english:
                'Strengthened his leadership role and consolidated the Party organisation.',
        },
    },
    {
        id: '1960-congress-iii',
        stage: {
            vietnamese: 'Kháng chiến chống Pháp & xây dựng miền Bắc',
            english: 'Resistance against the French & building the North',
        },
        period: { vietnamese: '1960', english: '1960' },
        event: {
            vietnamese:
                'Đại hội lần III tiếp tục tín nhiệm ông vào các chức vụ chủ chốt của Đảng. ![1960](/assets/roadmap-images/1960.png)',
            english:
                'The Third Party Congress reaffirmed him in the Party’s top leadership positions. ![1960](/assets/roadmap-images/1960.png)',
        },
        significance: {
            vietnamese:
                'Đảm bảo tính liên tục và nhất quán của đường lối cách mạng.',
            english:
                'Ensured continuity and consistency in revolutionary strategy.',
        },
    },
    {
        id: '1955-1969-war',
        stage: {
            vietnamese: 'Kháng chiến chống Mỹ – cứu nước & chuẩn bị hòa bình',
            english: 'Resistance against the US & preparing for peace',
        },
        period: { vietnamese: '1955 – 1969', english: '1955 – 1969' },
        event: {
            vietnamese:
                'Lãnh đạo kháng chiến chống Mỹ ở miền Nam thông qua Mặt trận Dân tộc Giải phóng miền Nam. ![1955-1969](/assets/roadmap-images/1955-1969.jpg)',
            english:
                'Directed the resistance against the United States in the South via the National Liberation Front. ![1955-1969](/assets/roadmap-images/1955-1969.jpg)',
        },
        significance: {
            vietnamese:
                'Tiếp tục mục tiêu thống nhất đất nước và bảo vệ chủ nghĩa xã hội.',
            english:
                'Pursued national reunification and defended socialism.',
        },
    },
    {
        id: '1965-health',
        stage: {
            vietnamese: 'Kháng chiến chống Mỹ – cứu nước & chuẩn bị hòa bình',
            english: 'Resistance against the US & preparing for peace',
        },
        period: { vietnamese: '1965 trở đi', english: 'From 1965 onward' },
        event: {
            vietnamese:
                'Do sức khỏe giảm sút, ông giảm dần sự can dự trực tiếp vào công việc lãnh đạo hàng ngày. ![1965](/assets/roadmap-images/1965-tro-di.jpg)',
            english:
                'As his health declined, he gradually reduced direct involvement in day-to-day leadership. ![1965](/assets/roadmap-images/1965-tro-di.jpg)',
        },
        significance: {
            vietnamese:
                'Chuyển giao trách nhiệm, đào tạo lớp kế thừa trong Đảng và Nhà nước.',
            english:
                'Facilitated leadership transition and mentored successors within the Party and state.',
        },
    },
    {
        id: '1965-1969-testament',
        stage: {
            vietnamese: 'Kháng chiến chống Mỹ – cứu nước & chuẩn bị hòa bình',
            english: 'Resistance against the US & preparing for peace',
        },
        period: { vietnamese: '1965 – 1969', english: '1965 – 1969' },
        event: {
            vietnamese:
                'Viết bản Di chúc, căn dặn nhiệm vụ của Đảng và dân tộc, nhấn mạnh đoàn kết và tình yêu thương con người. ![1965-1969](/assets/roadmap-images/1965-1969-di-chuc.jpg)',
            english:
                'Wrote his Testament, outlining Party and national duties and emphasising unity and human compassion. ![1965-1969](/assets/roadmap-images/1965-1969-di-chuc.jpg)',
        },
        significance: {
            vietnamese:
                'Di chúc trở thành nguồn tư tưởng căn bản, định hướng Tư tưởng Hồ Chí Minh về sau.',
            english:
                'The Testament became a foundational source guiding Hồ Chí Minh Thought in later years.',
        },
    },
    {
        id: '1969-passing',
        stage: {
            vietnamese: 'Qua đời & di sản',
            english: 'Passing & legacy',
        },
        period: { vietnamese: '02/9/1969', english: '2 September 1969' },
        event: {
            vietnamese: 'Qua đời tại Hà Nội, thọ 79 tuổi. ![1969](/assets/roadmap-images/2-9-1969.jpg)',
            english: 'Passed away in Hà Nội at the age of 79. ![1969](/assets/roadmap-images/2-9-1969.jpg)',
        },
        significance: {
            vietnamese:
                'Khép lại hành trình cách mạng cá nhân, để lại di sản tư tưởng và hình tượng lãnh tụ.',
            english:
                'Closed his revolutionary journey, leaving a profound intellectual and leadership legacy.',
        },
    },
    {
        id: '1973-1975-mausoleum',
        stage: {
            vietnamese: 'Qua đời & di sản',
            english: 'Passing & legacy',
        },
        period: { vietnamese: '1973 – 1975', english: '1973 – 1975' },
        event: {
            vietnamese:
                'Xây dựng Lăng Chủ tịch Hồ Chí Minh và đưa thi hài Người vào bảo quản; khánh thành năm 1975. ![1973-1975](/assets/roadmap-images/1973-1975.jpg)',
            english:
                'Constructed Hồ Chí Minh’s Mausoleum to preserve his body; inaugurated in 1975. ![1973-1975](/assets/roadmap-images/1973-1975.jpg)',
        },
        significance: {
            vietnamese:
                'Tôn vinh lãnh tụ, tạo biểu tượng quốc gia về đoàn kết và lòng biết ơn.',
            english:
                'Honoured the leader, creating a national symbol of unity and gratitude.',
        },
    },
]

export type RoadmapData = typeof roadmapEntries
