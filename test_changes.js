import axios from 'axios';

const API_KEY = 'AIzaSyC6aB2gDD0CTuzok3pggXAhRR9JCNq0IFY';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

async function testChanges() {
  try {
    // Test the new parameters: educational videos, long duration (no shorts), unique channels
    const searchResponse = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: 'javascript',
        type: 'video',
        videoCategoryId: '27', // Education category
        videoDuration: 'long', // Videos longer than 20 minutes
        maxResults: 10,
        key: API_KEY,
      },
    });

    const videoIds = searchResponse.data.items.map((item) => item.id.videoId).join(',');

    // Get details
    const detailsResponse = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoIds,
        key: API_KEY,
      },
    });

    console.log('Testing Changes: Educational videos >20min, unique channels, rating calculation');
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
        const views = parseInt(item.statistics.viewCount) || 0;
        const likes = parseInt(item.statistics.likeCount) || 0;
        const dislikes = parseInt(item.statistics.dislikeCount) || 0;
        const comments = parseInt(item.statistics.commentCount) || 0;

        // Calculate rating out of 10
        const viewScore = Math.min(views / 1000000, 1) * 4;
        const likeScore = Math.min(likes / 100000, 1) * 3;
        const commentScore = Math.min(comments / 10000, 1) * 2;
        const engagementScore = (likes / (likes + dislikes + 1)) * 1;
        const rating = Math.round((viewScore + likeScore + commentScore + engagementScore) * 10) / 10;

        return {
          title: item.snippet.title,
          duration: item.contentDetails.duration,
          rating: Math.min(rating, 10),
          channel: item.snippet.channelTitle,
        };
      });

    videos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title}`);
      console.log(`   Duration: ${video.duration}, Rating: ${video.rating}/10, Channel: ${video.channel}`);
    });

    console.log(`\nTotal videos after filtering: ${videos.length}`);
    console.log('All videos should be >20 minutes, educational, and from unique channels.');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testChanges();
