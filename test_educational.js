import axios from 'axios';

const API_KEY = 'AIzaSyC6aB2gDD0CTuzok3pggXAhRR9JCNq0IFY';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

async function testEducationalFilter() {
  try {
    const query = 'javascript';
    const educationalQuery = `${query} tutorial course learn programming`;

    console.log(`Original query: "${query}"`);
    console.log(`Educational query: "${educationalQuery}"`);

    const searchResponse = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: educationalQuery,
        type: 'video',
        videoCategoryId: '27', // Education category
        videoDuration: 'long', // Videos longer than 20 minutes
        maxResults: 10,
        key: API_KEY,
      },
    });

    const videoIds = searchResponse.data.items.map((item) => item.id.videoId).join(',');

    const detailsResponse = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoIds,
        key: API_KEY,
      },
    });

    console.log('\nTesting Educational Filter Results:');
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
      .map((item) => {
        return {
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          duration: item.contentDetails.duration,
          category: item.snippet.categoryId,
        };
      });

    videos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title}`);
      console.log(`   Channel: ${video.channel}, Duration: ${video.duration}, Category: ${video.category}`);
    });

    console.log(`\nTotal educational videos: ${videos.length}`);
    console.log('All should be educational (category 27), >20min, and contain tutorial/course/learn keywords.');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testEducationalFilter();
