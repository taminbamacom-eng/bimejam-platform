import { Request, Response } from 'express';
import prisma from '../db/client';

export async function getLeads(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const insuranceType = (req.query.insuranceType as string) || '';
    const status = (req.query.status as string) || '';
    const minScore = parseInt(req.query.minScore as string) || 0;
    const search = (req.query.search as string) || '';

    const skip = (page - 1) * limit;

    const where: any = {};

    if (insuranceType) {
      where.insuranceType = insuranceType;
    }

    if (status) {
      where.status = status;
    }

    if (minScore > 0) {
      where.score = { gte: minScore };
    }

    if (search) {
      where.OR = [
        { customer: { name: { contains: search } } },
        { customer: { phone: { contains: search } } },
        { intent: { contains: search } },
        { carModel: { contains: search } },
      ];
    }

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
        include: {
          customer: {
            select: { id: true, name: true, phone: true, city: true, email: true },
          },
          conversation: {
            select: { id: true, status: true, lastMessage: true, lastMessageAt: true },
          },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getLeadById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        customer: true,
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    if (!lead) {
      return res.status(404).json({ success: false, error: 'لید یافت نشد' });
    }

    return res.json({
      success: true,
      lead,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function createLead(req: Request, res: Response) {
  try {
    const {
      customerId,
      conversationId,
      insuranceType,
      score,
      status,
      intent,
      sentiment,
      carModel,
      urgency,
      estimatedValue,
      notes,
    } = req.body;

    if (!customerId || !insuranceType) {
      return res.status(400).json({
        success: false,
        error: 'شناسه مشتری و نوع بیمه الزامی است.',
      });
    }

    const newLead = await prisma.lead.create({
      data: {
        customerId,
        conversationId,
        insuranceType,
        score: score !== undefined ? score : 50,
        status: status || 'NEW',
        intent,
        sentiment,
        carModel,
        urgency,
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
        notes,
      },
      include: {
        customer: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'فرصت فروش (لید) جدید ایجاد شد',
      lead: newLead,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateLead(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, score, notes, urgency, estimatedValue, insuranceType } = req.body;

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(score !== undefined && { score }),
        ...(notes !== undefined && { notes }),
        ...(urgency && { urgency }),
        ...(estimatedValue !== undefined && { estimatedValue: parseFloat(estimatedValue) }),
        ...(insuranceType && { insuranceType }),
      },
      include: {
        customer: true,
      },
    });

    return res.json({
      success: true,
      message: 'فرصت فروش به‌روزرسانی شد',
      lead: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteLead(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.lead.delete({ where: { id } });

    return res.json({
      success: true,
      message: 'فرصت فروش حذف شد',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
