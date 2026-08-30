import axios from 'axios';

const GOFTINO_API = 'https://api.goftino.com/v1';

function getApiKey() {
  return process.env.GOFTINO_API_KEY;
}

export async function getGoftinoUserData(chatId: string) {
  const apiKey = getApiKey();

  if (!apiKey || !chatId) {
    console.warn('⚠️ Missing GOFTINO_API_KEY or chatId');
    return null;
  }

  try {
    const response = await axios.get(
      `${GOFTINO_API}/user_data`,
      {
        params: {
          chat_id: chatId,
        },
        headers: {
          'goftino-key': apiKey,
        },
      }
    );

    return response.data?.data || null;
  } catch (error: any) {
    console.error(
      '❌ Goftino user_data error:',
      error?.response?.data || error.message
    );

    return null;
  }
}


export async function getGoftinoVisitedPages(userId: string) {
  const apiKey = getApiKey();

  if (!apiKey || !userId) {
    console.warn('⚠️ Missing GOFTINO_API_KEY or userId');
    return [];
  }

  try {
    const response = await axios.get(
      `${GOFTINO_API}/user_visited_pages`,
      {
        params: {
          user_id: userId,
        },
        headers: {
          'goftino-key': apiKey,
        },
      }
    );

    return response.data?.data?.pages || [];
  } catch (error: any) {
    console.error(
      '❌ Goftino visited pages error:',
      error?.response?.data || error.message
    );

    return [];
  }
}
