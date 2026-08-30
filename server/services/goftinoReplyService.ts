// Goftino Reply Service - Prepare and handle outgoing messages to Goftino
export interface GoftinoOutboundMessage {
  chatId: string;
  message: string;
  timestamp: string;
  status: string;
}

const outboundLog: GoftinoOutboundMessage[] = [];

/**
 * Prepares outgoing message to Goftino user.
 * Currently logs and buffers the message for outgoing synchronization.
 */
export async function sendMessage(chatId: string, message: string) {
  console.log(`📤 [goftinoReplyService] Prepared outgoing reply for Chat ID ${chatId}: "${message}"`);

  const entry: GoftinoOutboundMessage = {
    chatId,
    message,
    timestamp: new Date().toISOString(),
    status: 'PREPARED_READY',
  };

  outboundLog.unshift(entry);
  if (outboundLog.length > 50) outboundLog.pop();

  return {
    success: true,
    chatId,
    message,
    status: 'PREPARED_READY',
    timestamp: entry.timestamp,
  };
}

export function getOutboundLogs() {
  return outboundLog;
}
