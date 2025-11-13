import axios from 'axios';

const API_KEY = 'AIzaSyC6aB2gDD0CTuzok3pggXAhRR9JCNq0IFY';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

async function testFullFunction() {
  try {
    // First, search for educational videos only
    const searchResponse = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: 'javascript',
        type: 'video',
        videoCategoryId: '27', // Education category
        maxResults: 50, // Increase to allow filtering for unique channels
        key: API_KEY,
      },
    });

    const videoIds = searchResponse.data.items.map((item) => item.id.videoId).join(',');

    // Then, get details including statistics
    const detailsResponse = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics',
        id: videoIds,
        key: API_KEY,
      },
    });

    // Filter to unique channels (one video per channel)
    const channelSet = new Set();
    const videos = detailsResponse.data.items
      .filter((item) => {
        const channelId = item.snippet.channelId;
        if (channelSet.has(channelId)) {
          return false;
        }
        channelSet.add(channelId);
        return true;
      })
      .map((item) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        views: formatViews(parseInt(item.statistics.viewCount)),
        rating: parseInt(item.statistics.likeCount) || 0,
        provider: 'YouTube',
        category: 'Education',
        aiSummary: `Learn about ${item.snippet.title} on YouTube.`,
        url: `https://www.youtube.com/watch?v=${item.id}`,
      }));

    console.log('Total videos after filtering unique channels:', videos.length);
    console.log('Sample videos:');
    videos.slice(0, 5).forEach(video => {
      console.log(`- ${video.title} (Views: ${video.views}, Rating: ${video.rating})`);
    });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

const formatViews = (views) => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

testFullFunction();
