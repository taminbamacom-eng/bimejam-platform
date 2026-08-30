import { Request, Response } from 'express';
import prisma from '../db/client';

export async function getNotifications(req: Request, res: Response) {
  try {
    const { read, priority, type } = req.query;

    const where: any = {};
    if (read !== undefined) {
      where.read = read === 'true';
    }
    if (priority && priority !== 'ALL') {
      where.priority = String(priority);
    }
    if (type && type !== 'ALL') {
      where.type = String(type);
    }

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        lead: { select: { id: true, insuranceType: true, score: true } },
        conversation: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { read: false },
    });

    return res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function markAsRead(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    return res.status(200).json({ success: true, data: notification });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function markAllAsRead(req: Request, res: Response) {
  try {
    await prisma.notification.updateMany({
      where: { read: false },
      data: { read: true },
    });
    return res.status(200).json({ success: true, message: 'تمام اعلانات خوانده شد' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
