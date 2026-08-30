import prisma from '../db/client';

export async function getAiResponsePolicy(category: string) {
  const policy = await prisma.aiResponsePolicy.findUnique({
    where: {
      category,
    },
  });

  return policy || {
    mode: 'AI_ALLOWED',
    priority: 'NORMAL',
    fallbackMessage: null,
  };
}
