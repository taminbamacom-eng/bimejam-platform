import { Request, Response } from 'express';
import prisma from '../db/client';
import { runAiPipelineForMessage, sendGoftinoMessage } from '../services/aiPipelineService';

// GET /api/ai/logs - Fetch AI logs with optional filtering
export async function getAiLogs(req: Request, res: Response) {
  try {
    const { conversationId, step, status, limit = '50' } = req.query;

    const whereClause: any = {};
    if (conversationId) whereClause.conversationId = String(conversationId);
    if (step) whereClause.step = String(step);
    if (status) whereClause.status = String(status);

    const logs = await prisma.aiLog.findMany({
      where: whereClause,
      take: Math.min(200, parseInt(String(limit), 10)),
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, count: logs.length, data: logs });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

// GET /api/ai/logs/stats - Fetch pipeline summary statistics
export async function getAiLogStats(req: Request, res: Response) {
  try {
    const [totalLogs, successLogs, errorLogs, warningLogs] = await Promise.all([
      prisma.aiLog.count({ where: { step: 'Completed' } }),
      prisma.aiLog.count({ where: { status: 'SUCCESS' } }),
      prisma.aiLog.count({ where: { status: 'ERROR' } }),
      prisma.aiLog.count({ where: { status: 'WARNING' } }),
    ]);

    const recentLogs = await prisma.aiLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: {
        totalPipelinesCompleted: totalLogs,
        totalSuccessSteps: successLogs,
        totalErrorSteps: errorLogs,
        totalWarningSteps: warningLogs,
        recentActivity: recentLogs,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

// POST /api/ai/retry-goftino - Re-send an AI message to Goftino
export async function retryGoftinoSend(req: Request, res: Response) {
  try {
    const { messageId, chatId, text } = req.body;

    if (!chatId || !text) {
      return res.status(400).json({ success: false, error: 'chatId and text are required.' });
    }

    const result = await sendGoftinoMessage(chatId, text);

    await prisma.aiLog.create({
      data: {
        messageId: messageId || null,
        step: 'Goftino Retry Send',
        status: result.success ? 'SUCCESS' : 'WARNING',
        details: result.success
          ? `ارسال مجدد با موفقیت انجام شد (کد: ${result.goftinoMsgId})`
          : `خطا در ارسال مجدد به گفتینو: ${result.error}`,
      },
    });

    return res.json({ success: true, result });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

// POST /api/ai/trigger - Manually trigger AI pipeline for a conversation
export async function triggerAiPipelineManually(req: Request, res: Response) {
  try {
    const { conversationId, userMessage } = req.body;

    if (!conversationId) {
      return res.status(400).json({ success: false, error: 'conversationId is required.' });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { customer: true },
    });

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found.' });
    }

    const messageText = userMessage || conversation.lastMessage || 'سلام';

    // Run AI pipeline
    runAiPipelineForMessage({
      conversationId: conversation.id,
      customerId: conversation.customerId,
      messageId: `manual_${Date.now()}`,
      userMessageContent: messageText,
    }).catch(console.error);

    return res.json({
      success: true,
      message: 'پایپ‌لاین هوش مصنوعی به‌صورت دستی شروع شد و مراحل آن در جدول لوگ‌ها ثبت می‌شود.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

// GET /api/ai/brain-logs - Fetch Brain Layer Logs
export async function getBrainLogs(req: Request, res: Response) {
  try {
    const { conversationId, intent, validationResult, limit = '50' } = req.query;

    const whereClause: any = {};
    if (conversationId) whereClause.conversationId = String(conversationId);
    if (intent) whereClause.intent = String(intent);
    if (validationResult) whereClause.validationResult = String(validationResult);

    const logs = await prisma.brainLog.findMany({
      where: whereClause,
      take: Math.min(200, parseInt(String(limit), 10)),
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, count: logs.length, data: logs });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

// GET /api/ai/brain-stats - Fetch Brain Layer Aggregate Metrics
export async function getBrainStats(req: Request, res: Response) {
  try {
    const [totalBrainExecutions, passedCount, rejectedCount, regeneratedCount] = await Promise.all([
      prisma.brainLog.count(),
      prisma.brainLog.count({ where: { validationResult: 'PASSED' } }),
      prisma.brainLog.count({ where: { validationResult: 'REJECTED' } }),
      prisma.brainLog.count({ where: { validationResult: 'REGENERATED' } }),
    ]);

    const recentBrainLogs = await prisma.brainLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: {
        totalBrainExecutions,
        passedCount,
        rejectedCount,
        regeneratedCount,
        recentBrainLogs,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
