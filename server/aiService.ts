import OpenAI from 'openai';
import { KnowledgeBaseData, CustomerAnalysis } from '../src/types';
import { getAiConfig } from './services/settingService';

export interface ProcessedAIOutput {
  replyText: string;
  analysis: CustomerAnalysis;
  modelUsed: string;
}

export async function getOpenAIClient(): Promise<OpenAI | null> {
  const config = await getAiConfig();
  const apiKey = config.openaiApiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export async function processGoftinoMessageWithAI(
  userMessage: string,
  clientMeta: { name?: string; phone?: string; page?: string; city?: string },
  knowledgeBase: KnowledgeBaseData,
  conversationHistory: Array<{ sender: 'client' | 'bot'; text: string }> = []
): Promise<ProcessedAIOutput> {
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

پاسخ شما خروجی JSON با ساختار زیر باشد:
{
  "replyText": "متن پاسخ رسمی و ترغیب‌کننده دستیار بیمه جم برای ارسال در چت گفتینو",
  "analysis": {
    "sentiment": "حس مشتری: مثبت (علاقمند) / مردد (نیاز به مشاوره) / بی‌علاقه / ناراضی / سوال تکنیکی / خنثی",
    "leadScore": 85,
    "customerIntent": "هدف اصلی مشتری: استعلام قیمت / تصمیم خرید قطعی / مقایسه بیمه‌ها / پیگیری خسارت / سوال عام",
    "extractedNeeds": {
      "insuranceType": "نوع بیمه مد نظر",
      "vehicleOrPropertyDetails": "جزئیات خودرو یا ملک ذکر شده",
      "budgetOrDiscountMentioned": "شرایط اقساط یا تخفیف درخواستی",
      "urgencyLevel": "بالا / متوسط / پایین"
    },
    "recommendedAction": "پیشنهاد اقدام بعدی به تیم فروش یا اپراتور انسانی بیمه جم",
    "keyInsights": ["نکته ۱", "نکته ۲"]
  }
}
`;

  // OpenAI (GPT-5 or configured model)
  try {
    const aiConfig = await getAiConfig();
    const openai = await getOpenAIClient();
    if (openai) {
      const configuredModel = aiConfig.openaiModel || 'gpt-5';
      let modelToUse = configuredModel;
      let responseText = '';
      try {
        const completion = await openai.chat.completions.create({
          model: configuredModel,
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: `سوابق گفتگوی قبلی:\n${historyContext || 'هیچ گفتگوی قبلی وجود ندارد.'}\n\nپیام جدید کاربر:\n"${userMessage}"`
            }
          ],
          response_format: { type: 'json_object' },
          temperature: aiConfig.temperature || 0.6,
        });
        responseText = completion.choices[0]?.message?.content || '{}';
      } catch (gptError: any) {
        console.warn(`${configuredModel} requested, attempting gpt-4o fallback:`, gptError?.message);
        modelToUse = 'gpt-4o';
        const fallbackCompletion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: `سوابق گفتگوی قبلی:\n${historyContext || 'هیچ گفتگوی قبلی وجود ندارد.'}\n\nپیام جدید کاربر:\n"${userMessage}"`
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.6,
        });
        responseText = fallbackCompletion.choices[0]?.message?.content || '{}';
      }

      const parsed = JSON.parse(responseText);
      return {
        replyText: parsed.replyText || 'با سلام و احترام، پیام شما در سیستم بیمه جم دریافت شد.',
        analysis: {
          sentiment: parsed.analysis?.sentiment || 'سوال تکنیکی / خنثی',
          leadScore: typeof parsed.analysis?.leadScore === 'number' ? parsed.analysis.leadScore : 75,
          customerIntent: parsed.analysis?.customerIntent || 'استعلام قیمت (Price Inquiry)',
          extractedNeeds: parsed.analysis?.extractedNeeds || { urgencyLevel: 'متوسط' },
          recommendedAction: parsed.analysis?.recommendedAction || 'بررسی و پیگیری توسط کارشناس بیمه جم',
          keyInsights: parsed.analysis?.keyInsights || ['استعلام اولیه بیمه']
        },
        modelUsed: `OpenAI ${modelToUse}`
      };
    }
  } catch (openaiErr) {
    console.error('OpenAI processing failed, activating fallback:', openaiErr);
  }

  // Rule-based fallback if OpenAI is temporarily unreachable
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
      keyInsights: ['درخواست استعلام بیمه در سیستم ثبت شد.']
    },
    modelUsed: 'سیستم هوشمند بیمه جم (پشتیبان)'
  };
}
