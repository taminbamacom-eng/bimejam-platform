import { Router, Request, Response } from 'express';

// In-memory data structures matching Goftino API models

export interface GoftinoApiChat {
  chat_id: string;
  chat_status: 'open' | 'closed';
  current_owner: string[];
  all_operators: string[];
  unread_messages: number;
  user_id: string;
  user_name: string;
  user_phone?: string;
  user_email?: string;
  last_message?: {
    sender: {
      from: 'operator' | 'user';
      id: string;
    };
    date: string;
    content: string;
    type: 'text' | 'voice' | 'file' | 'start_form' | 'delay_from' | 'offline_form' | 'question_answer';
  };
  messages: Array<{
    message_id: string;
    sender: {
      from: 'operator' | 'user';
      id: string;
    };
    date: string;
    content: string;
    type: 'text' | 'voice' | 'file' | 'start_form' | 'delay_from' | 'offline_form' | 'question_answer';
    is_seen?: boolean;
    reply_to?: string;
    fields?: Array<{ label: string; value: string }>;
  }>;
  user_info: {
    avatar?: string;
    name: string;
    email?: string;
    phone?: string;
    description?: string;
    tags: string[];
    metadata: Array<{ key: string; value: string }>;
    ip: string;
    location: string;
    browser: string;
    os: string;
    is_banned: boolean;
    last_url: string;
    last_visit: string;
    first_visit: string;
    page_view: string;
  };
  visited_pages: Array<{
    url: string;
    date: string;
    time_on_page: number;
  }>;
}

export const mockOperatorsList = [
  {
    operator_id: '607013e5fc6a0b37b4007c6d',
    name: 'دستیار بیمه جم',
    email: 'ahmad@bimehjam.ir',
    avatar: 'https://cdn.goftino.com/profile/avatar1.png',
    is_online: true
  },
  {
    operator_id: '609bee1fb5f9aa2640e9fd57',
    name: 'الهام کریمی (پشتیبانی درمان و بدنه)',
    email: 'elham@bimehjam.ir',
    avatar: 'https://cdn.goftino.com/profile/avatar2.png',
    is_online: true
  },
  {
    operator_id: '61031e563060c5ffe08f2525',
    name: 'رضا قربانی (مشاور خسارت)',
    email: 'reza@bimehjam.ir',
    avatar: 'https://cdn.goftino.com/profile/avatar3.png',
    is_online: false
  }
];

export const mockChatsStore: GoftinoApiChat[] = [
  {
    chat_id: '61225d8fc0925903200fbc74',
    chat_status: 'open',
    current_owner: ['607013e5fc6a0b37b4007c6d'],
    all_operators: ['607013e5fc6a0b37b4007c6d'],
    unread_messages: 1,
    user_id: '61225d87c0925903200fbc73b0423a29b1330017ea8498167e9a7c024d05c3c8',
    user_name: 'علی رضایی',
    user_phone: '09123456789',
    user_email: 'ali.rezaei@example.com',
    last_message: {
      sender: {
        from: 'user',
        id: '61225d87c0925903200fbc73b0423a29b1330017ea8498167e9a7c024d05c3c8'
      },
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      content: 'سلام، قیمت بیمه شخص ثالث پراید ۱۴۰۰ چقدر میشه؟ اقساطی هم دارین؟',
      type: 'text'
    },
    messages: [
      {
        message_id: 'msg_001',
        sender: {
          from: 'user',
          id: '61225d87c0925903200fbc73b0423a29b1330017ea8498167e9a7c024d05c3c8'
        },
        date: new Date(Date.now() - 3600000).toISOString().replace('T', ' ').substring(0, 19),
        content: 'سلام، قیمت بیمه شخص ثالث پراید ۱۴۰۰ چقدر میشه؟ اقساطی هم دارین؟',
        type: 'text',
        is_seen: true
      },
      {
        message_id: 'msg_002',
        sender: {
          from: 'operator',
          id: '607013e5fc6a0b37b4007c6d'
        },
        date: new Date(Date.now() - 3000000).toISOString().replace('T', ' ').substring(0, 19),
        content: 'سلام علی عزیز، بله در بیمه جم بدون چک و ضامن در ۴ قسط ارائه می‌شود! [button title="مشاهده استعلام" action="show_message" data="قیمت پایه حدود ۵.۱ میلیون تومان"]',
        type: 'text',
        is_seen: true
      }
    ],
    user_info: {
      avatar: 'https://cdn.goftino.com/profile/user1.png',
      name: 'علی رضایی',
      email: 'ali.rezaei@example.com',
      phone: '09123456789',
      description: 'مشتری بالقوه بیمه ثالث و بدنه پراید',
      tags: ['ثالث', 'اقساط', 'لید_داغ'],
      metadata: [{ key: 'car-model', value: 'Pride 1400' }],
      ip: '5.200.14.88',
      location: 'Iran, Tehran',
      browser: 'Chrome 122.0',
      os: 'Windows 11',
      is_banned: false,
      last_url: 'https://bimehjam.ir/third-party',
      last_visit: new Date().toISOString().replace('T', ' ').substring(0, 19),
      first_visit: new Date(Date.now() - 86400000 * 3).toISOString().replace('T', ' ').substring(0, 19),
      page_view: '14'
    },
    visited_pages: [
      { url: 'https://bimehjam.ir/third-party', date: '2024-05-20 14:20:10', time_on_page: 85 },
      { url: 'https://bimehjam.ir/calculator', date: '2024-05-20 14:22:00', time_on_page: 140 }
    ]
  },
  {
    chat_id: '61031e563060c5ffe08f8777',
    chat_status: 'open',
    current_owner: ['609bee1fb5f9aa2640e9fd57'],
    all_operators: ['609bee1fb5f9aa2640e9fd57'],
    unread_messages: 0,
    user_id: '61031e563060c5ffe08f9999',
    user_name: 'مریم احمدی',
    user_phone: '09351112233',
    user_email: 'm.ahmadi@example.com',
    last_message: {
      sender: {
        from: 'user',
        id: '61031e563060c5ffe08f9999'
      },
      date: new Date(Date.now() - 7200000).toISOString().replace('T', ' ').substring(0, 19),
      content: 'آیا بیمه درمان تکمیلی انفرادی دوره انتظار زایمان دارد؟',
      type: 'text'
    },
    messages: [
      {
        message_id: 'msg_101',
        sender: {
          from: 'user',
          id: '61031e563060c5ffe08f9999'
        },
        date: new Date(Date.now() - 7200000).toISOString().replace('T', ' ').substring(0, 19),
        content: 'آیا بیمه درمان تکمیلی انفرادی دوره انتظار زایمان دارد؟',
        type: 'text',
        is_seen: true
      }
    ],
    user_info: {
      name: 'مریم احمدی',
      email: 'm.ahmadi@example.com',
      phone: '09351112233',
      description: 'متقاضی بیمه درمان تکمیلی انفرادی',
      tags: ['درمان_تکمیلی', 'زایمان'],
      metadata: [{ key: 'inquiry-type', value: 'Health Insurance' }],
      ip: '2.180.45.12',
      location: 'Iran, Isfahan',
      browser: 'Safari Mobile',
      os: 'iOS 17',
      is_banned: false,
      last_url: 'https://bimehjam.ir/health-insurance',
      last_visit: new Date().toISOString().replace('T', ' ').substring(0, 19),
      first_visit: new Date(Date.now() - 86400000 * 5).toISOString().replace('T', ' ').substring(0, 19),
      page_view: '8'
    },
    visited_pages: [
      { url: 'https://bimehjam.ir/health-insurance', date: '2024-05-19 18:10:00', time_on_page: 210 }
    ]
  }
];

export const createGoftinoV1Router = () => {
  const router = Router();

  // Middleware checking goftino-key
  router.use((req: Request, res: Response, next) => {
    const key = req.headers['goftino-key'] || req.query['goftino-key'];
    // Allow request if key is provided or optional testing mode
    if (!key && req.query.strict === 'true') {
      res.status(401).json({ status: 'error', code: '1' });
      return;
    }
    next();
  });

  // 1. GET /v1/chats
  router.get('/chats', (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = Math.min(50, parseInt(req.query.limit as string || '20', 10));
    const status = req.query.status as string;

    let filtered = mockChatsStore;
    if (status) {
      filtered = filtered.filter(c => c.chat_status === status);
    }

    const chatsList = filtered.slice((page - 1) * limit, page * limit).map(c => ({
      chat_id: c.chat_id,
      chat_status: c.chat_status,
      current_owner: c.current_owner,
      all_operators: c.all_operators,
      unread_messages: c.unread_messages,
      user_id: c.user_id,
      user_name: c.user_name,
      last_message: c.last_message
    }));

    res.json({
      status: 'success',
      data: {
        chats: chatsList,
        page
      }
    });
  });

  // 2. GET /v1/chat_data
  router.get('/chat_data', (req: Request, res: Response) => {
    const chatId = req.query.chat_id as string;
    const userId = req.query.user_id as string;

    const chat = mockChatsStore.find(c => c.chat_id === chatId || c.user_id === userId);

    if (!chat) {
      res.status(400).json({ status: 'error', code: '2', message: 'Chat not found' });
      return;
    }

    res.json({
      status: 'success',
      data: {
        messages_count: chat.messages.length,
        chat_status: chat.chat_status,
        current_owner: chat.current_owner,
        all_operators: chat.all_operators,
        chat_id: chat.chat_id,
        user_id: chat.user_id,
        messages: chat.messages
      }
    });
  });

  // 3. POST /v1/send_message
  router.post('/send_message', (req: Request, res: Response) => {
    const { chat_id, operator_id, message, reply_id } = req.body;

    if (!chat_id || !operator_id || !message) {
      res.status(400).json({ status: 'error', code: '2', message: 'chat_id, operator_id and message are required' });
      return;
    }

    const chat = mockChatsStore.find(c => c.chat_id === chat_id);
    const msgId = 'msg_' + Date.now();
    const formattedDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (chat) {
      const newMsg = {
        message_id: msgId,
        sender: { from: 'operator' as const, id: operator_id },
        date: formattedDate,
        content: message,
        type: 'text' as const,
        is_seen: false,
        reply_to: reply_id
      };
      chat.messages.push(newMsg);
      chat.last_message = {
        sender: { from: 'operator', id: operator_id },
        date: formattedDate,
        content: message,
        type: 'text'
      };
    }

    res.json({
      status: 'success',
      data: {
        message_id: msgId
      }
    });
  });

  // 4. POST /v1/send_file
  router.post('/send_file', (req: Request, res: Response) => {
    const { chat_id, operator_id, file_url, file_name, file_size } = req.body;

    if (!chat_id || !operator_id || !file_url || !file_name) {
      res.status(400).json({ status: 'error', code: '2' });
      return;
    }

    const msgId = 'file_msg_' + Date.now();
    const chat = mockChatsStore.find(c => c.chat_id === chat_id);
    if (chat) {
      const formattedDate = new Date().toISOString().replace('T', ' ').substring(0, 19);
      chat.messages.push({
        message_id: msgId,
        sender: { from: 'operator', id: operator_id },
        date: formattedDate,
        content: `[فایل: ${file_name}](${file_url})`,
        type: 'file',
        is_seen: false
      });
    }

    res.json({
      status: 'success',
      data: {
        message_id: msgId
      }
    });
  });

  // 5. POST /v1/send_message_from_user
  router.post('/send_message_from_user', (req: Request, res: Response) => {
    const { chat_id, message, reply_id } = req.body;

    if (!chat_id || !message) {
      res.status(400).json({ status: 'error', code: '2' });
      return;
    }

    const msgId = 'user_msg_' + Date.now();
    const chat = mockChatsStore.find(c => c.chat_id === chat_id);
    if (chat) {
      const formattedDate = new Date().toISOString().replace('T', ' ').substring(0, 19);
      chat.messages.push({
        message_id: msgId,
        sender: { from: 'user', id: chat.user_id },
        date: formattedDate,
        content: message,
        type: 'text',
        is_seen: false,
        reply_to: reply_id
      });
      chat.unread_messages += 1;
    }

    res.json({
      status: 'success',
      data: {
        message_id: msgId
      }
    });
  });

  // 6. POST /v1/operator_typing
  router.post('/operator_typing', (req: Request, res: Response) => {
    res.json({ status: 'success' });
  });

  // 7. POST /v1/close_chat
  router.post('/close_chat', (req: Request, res: Response) => {
    const { chat_id } = req.body;
    const chat = mockChatsStore.find(c => c.chat_id === chat_id);
    if (chat) {
      chat.chat_status = 'closed';
    }
    res.json({ status: 'success' });
  });

  // 8. POST /v1/assign_chat
  router.post('/assign_chat', (req: Request, res: Response) => {
    const { chat_id, to_operator } = req.body;
    const chat = mockChatsStore.find(c => c.chat_id === chat_id);
    if (chat && Array.isArray(to_operator)) {
      chat.current_owner = to_operator;
      chat.all_operators = Array.from(new Set([...chat.all_operators, ...to_operator]));
    }
    res.json({ status: 'success' });
  });

  // 9. POST /v1/unassign_chat
  router.post('/unassign_chat', (req: Request, res: Response) => {
    const { chat_id } = req.body;
    const chat = mockChatsStore.find(c => c.chat_id === chat_id);
    if (chat) {
      chat.current_owner = [];
    }
    res.json({ status: 'success' });
  });

  // 10. POST /v1/send_poll
  router.post('/send_poll', (req: Request, res: Response) => {
    res.json({ status: 'success' });
  });

  // 11. GET /v1/user_unread_messages
  router.get('/user_unread_messages', (req: Request, res: Response) => {
    const chatId = req.query.chat_id as string;
    const chat = mockChatsStore.find(c => c.chat_id === chatId) || mockChatsStore[0];

    const unreadMsgs = chat.messages.filter(m => m.sender.from === 'operator' && !m.is_seen);

    res.json({
      status: 'success',
      data: {
        messages_count: unreadMsgs.length,
        chat_status: chat.chat_status,
        chat_id: chat.chat_id,
        user_id: chat.user_id,
        messages: unreadMsgs
      }
    });
  });

  // 12. POST /v1/create_chat
  router.post('/create_chat', (req: Request, res: Response) => {
    const { user_message, operator_message, operator_id } = req.body;

    const newChatId = 'chat_' + Date.now();
    const newUserId = 'user_' + Date.now();
    const formattedDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const initialMsg = user_message || operator_message || 'سلام';

    const newChat: GoftinoApiChat = {
      chat_id: newChatId,
      chat_status: 'open',
      current_owner: operator_id ? [operator_id] : ['607013e5fc6a0b37b4007c6d'],
      all_operators: operator_id ? [operator_id] : ['607013e5fc6a0b37b4007c6d'],
      unread_messages: 1,
      user_id: newUserId,
      user_name: 'کاربر جدید',
      last_message: {
        sender: { from: user_message ? 'user' : 'operator', id: user_message ? newUserId : (operator_id || '607013e5fc6a0b37b4007c6d') },
        date: formattedDate,
        content: initialMsg,
        type: 'text'
      },
      messages: [
        {
          message_id: 'm_' + Date.now(),
          sender: { from: user_message ? 'user' : 'operator', id: user_message ? newUserId : (operator_id || '607013e5fc6a0b37b4007c6d') },
          date: formattedDate,
          content: initialMsg,
          type: 'text',
          is_seen: false
        }
      ],
      user_info: {
        name: 'کاربر جدید',
        tags: [],
        metadata: [],
        ip: '127.0.0.1',
        location: 'Iran',
        browser: 'Chrome',
        os: 'Windows',
        is_banned: false,
        last_url: 'https://bimehjam.ir',
        last_visit: formattedDate,
        first_visit: formattedDate,
        page_view: '1'
      },
      visited_pages: [{ url: 'https://bimehjam.ir', date: formattedDate, time_on_page: 30 }]
    };

    mockChatsStore.unshift(newChat);

    res.json({
      status: 'success',
      data: {
        chat_id: newChatId,
        user_id: newUserId
      }
    });
  });

  // 13. POST /v1/remove_chat
  router.post('/remove_chat', (req: Request, res: Response) => {
    const { chat_id } = req.body;
    const index = mockChatsStore.findIndex(c => c.chat_id === chat_id);
    if (index !== -1) {
      mockChatsStore.splice(index, 1);
    }
    res.json({ status: 'success' });
  });

  // 14. POST /v1/widget
  router.post('/widget', (req: Request, res: Response) => {
    res.json({ status: 'success' });
  });

  // 15. POST /v1/dispatch_js_event
  router.post('/dispatch_js_event', (req: Request, res: Response) => {
    res.json({ status: 'success' });
  });

  // 16. GET /v1/user_data & POST /v1/user_data
  router.get('/user_data', (req: Request, res: Response) => {
    const chatId = req.query.chat_id as string;
    const userId = req.query.user_id as string;

    const chat = mockChatsStore.find(c => c.chat_id === chatId || c.user_id === userId) || mockChatsStore[0];

    res.json({
      status: 'success',
      data: {
        ...chat.user_info,
        chat_id: chat.chat_id,
        user_id: chat.user_id
      }
    });
  });

  router.post('/user_data', (req: Request, res: Response) => {
    const { user_id, name, phone, email, tags, metadata } = req.body;
    const chat = mockChatsStore.find(c => c.user_id === user_id);
    if (chat) {
      if (name) chat.user_info.name = name;
      if (phone) chat.user_info.phone = phone;
      if (email) chat.user_info.email = email;
      if (tags) chat.user_info.tags = tags;
      if (metadata) chat.user_info.metadata = metadata;
    }
    res.json({ status: 'success' });
  });

  // 17. POST /v1/ban_user
  router.post('/ban_user', (req: Request, res: Response) => {
    const { user_id, chat_id } = req.body;
    const chat = mockChatsStore.find(c => c.chat_id === chat_id || c.user_id === user_id);
    if (chat) {
      chat.user_info.is_banned = true;
    }
    res.json({ status: 'success' });
  });

  // 18. GET /v1/user_visited_pages
  router.get('/user_visited_pages', (req: Request, res: Response) => {
    const userId = req.query.user_id as string;
    const chat = mockChatsStore.find(c => c.user_id === userId) || mockChatsStore[0];

    res.json({
      status: 'success',
      data: {
        pages: chat.visited_pages
      }
    });
  });

  // 19. GET /v1/operators
  router.get('/operators', (_req: Request, res: Response) => {
    res.json({
      status: 'success',
      data: {
        operators: mockOperatorsList
      }
    });
  });

  // 20. GET /v1/operator_data
  router.get('/operator_data', (req: Request, res: Response) => {
    const email = req.query.email as string;
    const operatorId = req.query.operator_id as string;

    const op = mockOperatorsList.find(o => o.email === email || o.operator_id === operatorId) || mockOperatorsList[0];

    res.json({
      status: 'success',
      data: op
    });
  });

  return router;
};
