import axios from 'axios';

import { blogData } from '@/data/blog-data';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
console.log('GEMINI_API_KEY:', API_KEY);
const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const MAX_CONVERSATION_PAIRS = 7;
const MAX_CONTEXT_SECTIONS = 3;
const MAX_CONTEXT_CHARS_PER_SECTION = 1800;
const MIN_KEYWORD_LENGTH = 3;

interface KnowledgeEntry {
  id: string;
  title: string;
  snippet: string;
  tokenSet: Set<string>;
  tokenFrequency: Record<string, number>;
}

const normalizeText = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const extractKeywords = (text: string) => {
  const normalized = normalizeText(text);
  const tokens = normalized.match(/[a-z0-9]+/g) ?? [];
  const filtered = tokens.filter((token) => token.length >= MIN_KEYWORD_LENGTH);
  return Array.from(new Set(filtered));
};

const buildSnippet = (vietnamese?: string, english?: string) => {
  const segments = [] as string[];
  const vn = vietnamese?.trim();
  const en = english?.trim();

  if (vn) {
    segments.push(vn);
  }

  if (en) {
    segments.push(`English Reference:\n${en}`);
  }

  const rawSnippet = segments.join('\n\n');
  if (rawSnippet.length <= MAX_CONTEXT_CHARS_PER_SECTION) {
    return rawSnippet;
  }

  return `${rawSnippet.slice(0, MAX_CONTEXT_CHARS_PER_SECTION)}…`;
};

const buildTokenStats = (...segments: string[]) => {
  const combinedForTokens = segments.filter(Boolean).join(' ');
  const normalized = normalizeText(combinedForTokens);
  const tokens = normalized.match(/[a-z0-9]+/g) ?? [];

  const tokenFrequency = tokens.reduce<Record<string, number>>((acc, token) => {
    acc[token] = (acc[token] ?? 0) + 1;
    return acc;
  }, {});

  return {
    tokenSet: new Set(Object.keys(tokenFrequency)),
    tokenFrequency,
  };
};

const buildQuizEntries = () => {
  const quizEntries: KnowledgeEntry[] = [];

  Object.values(blogData).forEach((entry) => {
    const vietnameseQuestions = entry.quiz?.vietnamese ?? [];
    const englishQuestions = entry.quiz?.english ?? [];
    const totalQuestions = Math.max(vietnameseQuestions.length, englishQuestions.length);

    for (let index = 0; index < totalQuestions; index += 1) {
      const vietnameseQuestion = vietnameseQuestions[index];
      const englishQuestion = englishQuestions[index];

      if (!vietnameseQuestion && !englishQuestion) {
        continue;
      }

      const vietnameseAnswer =
        vietnameseQuestion?.options?.[vietnameseQuestion.correct] ?? '';
      const englishAnswer = englishQuestion?.options?.[englishQuestion.correct] ?? '';

      const vietnameseSegment = vietnameseQuestion
        ? [
            `Câu hỏi: ${vietnameseQuestion.question}`,
            vietnameseQuestion.options?.length
              ? `Các đáp án: ${vietnameseQuestion.options.join('; ')}`
              : undefined,
            vietnameseAnswer ? `Đáp án đúng: ${vietnameseAnswer}` : undefined,
          ]
            .filter(Boolean)
            .join('\n')
        : undefined;

      const englishSegment = englishQuestion
        ? [
            `Question: ${englishQuestion.question}`,
            englishQuestion.options?.length
              ? `Options: ${englishQuestion.options.join('; ')}`
              : undefined,
            englishAnswer ? `Correct answer: ${englishAnswer}` : undefined,
          ]
            .filter(Boolean)
            .join('\n')
        : undefined;

      const snippet = buildSnippet(vietnameseSegment, englishSegment);
      const { tokenSet, tokenFrequency } = buildTokenStats(
        entry.title?.vietnamese ?? '',
        entry.title?.english ?? '',
        vietnameseSegment ?? '',
        englishSegment ?? ''
      );

      const baseVietnameseTitle = entry.title?.vietnamese ?? entry.title?.english ?? `Mục ${entry.id}`;
      const baseEnglishTitle = entry.title?.english ?? entry.title?.vietnamese ?? `Section ${entry.id}`;

      quizEntries.push({
        id: `quiz-${entry.id}-${index}`,
        title: `[Quiz] ${baseVietnameseTitle} / ${baseEnglishTitle} – Câu hỏi ${index + 1}`,
        snippet,
        tokenSet,
        tokenFrequency,
      });
    }
  });

  return quizEntries;
};

const knowledgeBase: KnowledgeEntry[] = [
  ...Object.values(blogData).map((entry) => {
    const vietnameseContent = entry.content?.vietnamese ?? '';
    const englishContent = entry.content?.english ?? '';
    const snippet = buildSnippet(vietnameseContent, englishContent);
    const { tokenSet, tokenFrequency } = buildTokenStats(
      entry.title?.vietnamese ?? '',
      entry.title?.english ?? '',
      vietnameseContent,
      englishContent
    );

    return {
      id: `blog-${entry.id}`,
      title: entry.title?.vietnamese ?? entry.title?.english ?? `Mục ${entry.id}`,
      snippet,
      tokenSet,
      tokenFrequency,
    };
  }),
  ...buildQuizEntries(),
];

const CONTEXT_PROMPT_PREFIX = [
  'Bạn sẽ nhận được một số đoạn trích từ tài liệu nội bộ do người dùng cung cấp.',
  'Hãy dựa hoàn toàn vào các đoạn trích đó khi trả lời câu hỏi. Nếu thông tin không có trong tài liệu, hãy nói rõ và đề xuất người dùng cung cấp thêm.',
  'Luôn ưu tiên trả lời bằng cùng ngôn ngữ với câu hỏi của người dùng.',
].join('\n');

const NO_CONTEXT_PROMPT_PREFIX = [
  'Không tìm thấy đoạn trích phù hợp trong kho tài liệu nội bộ cho câu hỏi sau.',
  'Hãy giải thích rằng bạn không thể trả lời dựa trên tài liệu hiện có và đề nghị người dùng cung cấp thêm dữ liệu. Không được sử dụng kiến thức bên ngoài.',
  'Luôn phản hồi bằng ngôn ngữ của câu hỏi.',
].join('\n');

const buildContextPrompt = (prompt: string) => {
  const keywords = extractKeywords(prompt);
  if (!keywords.length) {
    return '';
  }

  const scored = knowledgeBase
    .map((entry) => {
      const score = keywords.reduce((acc, keyword) => {
        if (!entry.tokenSet.has(keyword)) {
          return acc;
        }
        return acc + (entry.tokenFrequency[keyword] ?? 0);
      }, 0);

      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CONTEXT_SECTIONS);

  if (!scored.length) {
    return '';
  }

  return scored
    .map(({ entry }) => `### ${entry.title}\n${entry.snippet}`)
    .join('\n\n');
};

interface ContentPart {
  text: string;
}

interface Content {
  role: 'user' | 'model';
  parts: ContentPart[];
}

interface GeminiApiRequestBody {
  contents: Content[];
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
  };
  safetySettings: {
    category: string;
    threshold: string;
  }[];
}

interface GeminiApiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

class GeminiApiClient {
  private apiEndpoint: string;
  private chatHistory: Content[] = [];
  private initialInstructionGiven = false;

  constructor(endpoint: string = GEMINI_API_ENDPOINT) {
    this.apiEndpoint = endpoint;
  }

  /**
   * Thiết lập hướng dẫn ban đầu để cố định vai trò chuyên gia triết học.
   */
  private ensureInitialInstruction() {
    if (!this.initialInstructionGiven) {
      this.chatHistory = [
        {
          role: 'user',
          parts: [
            {
              text: `
Bạn là một chuyên gia triết học với kiến thức chuyên sâu, am hiểu cả triết học phương Đông lẫn phương Tây, từ cổ đại đến hiện đại.

Quy tắc phản hồi của bạn:
1. Trả lời sâu sắc, có dẫn giải rõ ràng về mọi vấn đề triết học (đặc biệt lý luận kinh tế chính trị của C. Mác nếu được hỏi).
2. Sử dụng ngôn ngữ dễ hiểu để truyền tải các khái niệm phức tạp.
3. Luôn duy trì phong thái học thuật, khách quan và chuyên nghiệp trong từng câu trả lời.
            `.trim(),
            },
          ],
        },
        {
          role: 'model',
          parts: [
            {
              text: 'Vâng, tôi đã sẵn sàng hỗ trợ bạn với các vấn đề triết học một cách nghiêm túc và chuyên sâu.',
            },
          ],
        },
      ];
      this.initialInstructionGiven = true;
    }
  }

  /**
   * Giữ lịch sử hội thoại ở mức phù hợp để tránh vượt quá token limit.
   */
  private trimChatHistory() {
    if (this.chatHistory.length > 2 + MAX_CONVERSATION_PAIRS * 2) {
      const startIndex = this.chatHistory.length - (MAX_CONVERSATION_PAIRS * 2);
      this.chatHistory = [
        this.chatHistory[0],
        this.chatHistory[1],
        ...this.chatHistory.slice(startIndex),
      ];
    }
  }

  /**
   * Gửi yêu cầu sinh nội dung từ mô hình Gemini.
   */
  async generateContent(prompt: string): Promise<string> {
    this.ensureInitialInstruction();

    const context = buildContextPrompt(prompt);
    const finalPrompt = context
      ? `${CONTEXT_PROMPT_PREFIX}\n\n${context}\n\nCâu hỏi: ${prompt}`
      : `${NO_CONTEXT_PROMPT_PREFIX}\n\nCâu hỏi: ${prompt}`;

    this.chatHistory.push({ role: 'user', parts: [{ text: finalPrompt }] });
    this.trimChatHistory();

    const requestBody: GeminiApiRequestBody = {
      contents: this.chatHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    try {
      const response = await axios.post<GeminiApiResponse>(this.apiEndpoint, requestBody, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 45000,
      });

      const botResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!botResponse) {
        throw new Error('Phản hồi từ Gemini API không đúng định dạng.');
      }

      this.chatHistory.push({ role: 'model', parts: [{ text: botResponse }] });
      return botResponse;

    } catch (error: any) {
      if (this.chatHistory.length > 0 && this.chatHistory[this.chatHistory.length - 1].role === 'user') {
        this.chatHistory.pop();
      }

      console.error('Lỗi khi gọi Gemini API:', error.response?.data || error.message);
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.error?.message || 'Lỗi không xác định từ máy chủ.';
        if (status === 429) throw new Error(`Hệ thống đang quá tải, vui lòng thử lại sau. (${errorMessage})`);
        throw new Error(`Lỗi từ API: ${status} - ${errorMessage}`);
      }
      throw error;
    }
  }

  resetChatHistory() {
    this.chatHistory = [];
    this.initialInstructionGiven = false;
  }
}

export const geminiApiClient = new GeminiApiClient();
