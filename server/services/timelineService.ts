import prisma from '../db/client';

export type TimelineEventType =
  | 'CONVERSATION_CREATED'
  | 'CUSTOMER_REPLIED'
  | 'AI_ASKED_QUESTION'
  | 'COLLECTED_DATA_UPDATED'
  | 'CONVERSATION_ASSIGNED'
  | 'PRICE_REQUEST_COMPLETED'
  | 'OPERATOR_JOINED'
  | 'PRICE_SENT'
  | 'OPERATOR_MESSAGE_SENT'
  | 'PURCHASE_REQUESTED'
  | 'POLICY_ISSUED'
  | 'CONVERSATION_CLOSED';

export interface CreateTimelineEventInput {
  customerId?: string | null;
  conversationId?: string | null;
  type: TimelineEventType;
  title: string;
  description?: string;
  actor?: 'SYSTEM' | 'CUSTOMER' | 'AI' | 'OPERATOR';
  metadata?: Record<string, any>;
}

/**
 * Creates a recorded event in the CRM timeline.
 */
export async function createTimelineEvent(input: CreateTimelineEventInput) {
  try {
    const event = await prisma.timelineEvent.create({
      data: {
        customerId: input.customerId || null,
        conversationId: input.conversationId || null,
        type: input.type,
        title: input.title,
        description: input.description || null,
        actor: input.actor || 'SYSTEM',
        metadata: input.metadata ? JSON.stringify(input.metadata) : '{}',
      },
    });
    return event;
  } catch (error) {
    console.error('⚠️ Failed to create timeline event:', error);
    return null;
  }
}

/**
 * Get full timeline for a customer
 */
export async function getTimelineForCustomer(customerId: string) {
  return prisma.timelineEvent.findMany({
    where: { customerId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get full timeline for a conversation
 */
export async function getTimelineForConversation(conversationId: string) {
  return prisma.timelineEvent.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'desc' },
  });
}
