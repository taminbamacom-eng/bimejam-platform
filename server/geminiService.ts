import { GoogleGenAI, Type } from '@google/genai';
import { KnowledgeBaseData, CustomerAnalysis } from '../src/types';

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is missing from environment variables.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

export interface ProcessedGoftinoAIOutput {
  replyText: string;
  analysis: CustomerAnalysis;
}

export async function processGoftinoMessageWithGemini(
  userMessage: string,
  clientMeta: { name?: string; phone?: string; page?: string; city?: string },
  knowledgeBase: KnowledgeBaseData,
  conversationHistory: Array<{ sender: 'client' | 'bot'; text: string }> = []
): Promise<ProcessedGoftinoAIOutput> {
  const ai = getGeminiClient();

  const historyContext = conversationHistory
    .slice(-6)
    .map((msg) => `${msg.sender === 'client' ? 'کاربر' : 'دستیار بیمه جم'}: ${msg.text}`)
    .join('\n');

  const systemPrompt = `
${knowledgeBase.systemPrompt}

نام شرکت: ${knowledgeBase.companyName}
شماره تماس مشاور: ${knowledgeBase.consultantPhone}
اطلاعات تعرفه شخص ثالث: پراید پایه ${knowledgeBase.thirdPartyTariffs.basePrides.toLocaleString('fa-IR')}، پژو ${knowledgeBase.thirdPartyTariffs.basePeugeot.toLocaleString('fa-IR')}
نکات بیمه بدنه: ${knowledgeBase.hullInsuranceNotes}
نکات بیمه درمان: ${knowledgeBase.healthInsuranceNotes}
نکات بیمه آتش‌سوزی: ${knowledgeBase.fireInsuranceNotes}

سوالات متداول مرتبط:
${knowledgeBase.frequentlyAskedQuestions.map((faq) => `- سوال: ${faq.question} | پاسخ: ${faq.answer}`).join('\n')}

اطلاعات مشتری در گفتینو:
- نام: ${clientMeta.name || 'مشتری جدید'}
- شهر: ${clientMeta.city || 'نامشخص'}
- صفحه بازدید شده: ${clientMeta.page || 'صفحه اصلی بیمه جم'}
- شماره همراه: ${clientMeta.phone || 'ثبت نشده'}

وظیفه شما:
یک پاسخ هوشمندانه، کامل، جذاب و مودبانه به زبان فارسی برای ارسال در چت گفتینو تولید کنید، و همزمان رفتار، نیت خرید (Intent)، احساسات (Sentiment) و میزان ارزشمندی مشتری (Lead Score بین ۰ تا ۱۰۰) را تحلیل کنید.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `
سوابق گفتگوی قبلی:
${historyContext || 'هیچ گفتگوی قبلی وجود ندارد.'}

پیام جدید دریافت شده از کاربر در گفتینو:
"${userMessage}"

لطفا پاسخ و تحلیل را دقیقا در قالب JSON خروجی دهید.
`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyText: {
              type: Type.STRING,
              description: 'متن پاسخ رسمی و ترغیب‌کننده دستیار بیمه جم برای ارسال در چت گفتینو'
            },
            analysis: {
              type: Type.OBJECT,
              properties: {
                sentiment: {
                  type: Type.STRING,
                  description: 'حس مشتری: مثبت (علاقمند) / مردد (نیاز به مشاوره) / بی‌علاقه / ناراضی / سوال تکنیکی / خنثی'
                },
                leadScore: {
                  type: Type.INTEGER,
                  description: 'امتیاز احتمال تبدیل به خریدار بین 0 تا 100'
                },
                customerIntent: {
                  type: Type.STRING,
                  description: 'هدف اصلی مشتری: استعلام قیمت / تصمیم خرید قطعی / مقایسه بیمه‌ها / پیگیری خسارت / سوال عام'
                },
                extractedNeeds: {
                  type: Type.OBJECT,
                  properties: {
                    insuranceType: { type: Type.STRING, description: 'نوع بیمه مد نظر (مثلا شخص ثالث، بدنه، درمان)' },
                    vehicleOrPropertyDetails: { type: Type.STRING, description: 'جزئیات خودرو یا ملک ذکر شده' },
                    budgetOrDiscountMentioned: { type: Type.STRING, description: 'شرایط اقساط یا تخفیف درخواستی' },
                    urgencyLevel: { type: Type.STRING, description: 'سطح عجله مشتری: بالا / متوسط / پایین' }
                  }
                },
                recommendedAction: {
                  type: Type.STRING,
                  description: 'پیشنهاد اقدام بعدی به تیم فروش یا اپراتور انسانی بیمه جم'
                },
                keyInsights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'نکات کلیدی استخراج شده از پیام کاربر'
                }
              },
              required: ['sentiment', 'leadScore', 'customerIntent', 'extractedNeeds', 'recommendedAction', 'keyInsights']
            }
          },
          required: ['replyText', 'analysis']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      replyText: parsed.replyText || 'با سلام و احترام، پیام شما دریافت شد. کارشناسان بیمه جم در خدمت شما هستند.',
      analysis: {
        sentiment: parsed.analysis?.sentiment || 'سوال تکنیکی / خنثی',
        leadScore: typeof parsed.analysis?.leadScore === 'number' ? parsed.analysis.leadScore : 50,
        customerIntent: parsed.analysis?.customerIntent || 'استعلام قیمت (Price Inquiry)',
        extractedNeeds: parsed.analysis?.extractedNeeds || { urgencyLevel: 'متوسط' },
        recommendedAction: parsed.analysis?.recommendedAction || 'بررسی و پیگیری توسط کارشناس بیمه جم',
        keyInsights: parsed.analysis?.keyInsights || ['استعلام اولیه بیمه']
      }
    };
  } catch (error) {
    console.error('Error executing Gemini analysis for Goftino message:', error);
    // Fallback if API fails or quota limit hit
    return {
      replyText: `سلام ${clientMeta.name || 'دوست عزیز'}، به بیمه جم خوش آمدید. پیام شما جهت استعلام بیمه دریافت شد. جهت دریافت سریع‌ترین مشاوره می‌توانید با شماره ۰۲۱-۹۱۰۰۸۸۸۸ تماس بگیرید.`,
      analysis: {
        sentiment: 'مردد (نیاز به مشاوره)',
        leadScore: 65,
        customerIntent: 'استعلام قیمت (Price Inquiry)',
        extractedNeeds: {
          insuranceType: 'شخص ثالث / عمومی',
          urgencyLevel: 'متوسط'
        },
        recommendedAction: 'ارسال پیامک پیگیری یا تماس تلفنی از طرف کارشناس فروش',
        keyInsights: ['درخواست استعلام بیمه در سیستم گفتینو ثبت شد.']
      }
    };
  }
}
