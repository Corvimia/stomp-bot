import axios from "axios";
import dayjs from "dayjs";

const getTweetImageCount = async (tweetId: string) => {
  const url = `https://api.twitter.com/2/tweets/${tweetId}?expansions=attachments.media_keys&media.fields=url`;
  const result = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_TOKEN}`
    }
  })

  return result?.data?.includes?.media?.length || 0;
};

const getTweetThreadCount = async (tweetId: string, author: string): Promise<number> => {

  const url = `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=conversation_id,created_at`;
  const result = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_TOKEN}`
    }
  });

  const {conversation_id, created_at} = result.data.data;

  if(dayjs(created_at) < dayjs().add(-7, 'day')){
    return 0;
  }
console.log({conversation_id, created_at, data:result.data})
  const url2 = `https://api.twitter.com/2/tweets/search/recent?query=conversation_id:${conversation_id} from:${author} to:${author}`;
  const result2 = await axios.get(url2, {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_TOKEN}`
    }
  });

  return result2.data?.meta?.result_count;
}

const getTweetMeta = async (message: string): Promise<{ images: number; isTwitter: boolean; thread: number }> => {

  const [, author, tweetId] = message.match(/twitter.*?\/(\w+)\/status\/(\d+)/) ?? [];

  if (!author || !tweetId) {
    return {
      isTwitter: false,
      thread: 0,
      images: 0,
    };
  }

  return {
    isTwitter: true,
    thread: await getTweetThreadCount(tweetId, author),
    images: await getTweetImageCount(tweetId),
  };
};

export default { getTweetMeta };
