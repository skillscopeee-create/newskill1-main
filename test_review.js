import axios from 'axios';

const API_KEY = 'AIzaSyC6aB2gDD0CTuzok3pggXAhRR9JCNq0IFY';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

async function testReviewCalculation() {
  try {
    // First, search for educational videos only
    const searchResponse = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: 'javascript',
        type: 'video',
        videoCategoryId: '27', // Education category
        maxResults: 5,
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

    console.log('Review Percentage Calculation Test:');
    detailsResponse.data.items.forEach((item) => {
      const views = parseInt(item.statistics.viewCount) || 0;
      const likes = parseInt(item.statistics.likeCount) || 0;
      const dislikes = parseInt(item.statistics.dislikeCount) || 0;
      const comments = parseInt(item.statistics.commentCount) || 0;

      // Calculate review percentage out of 10 based on views, likes, dislikes, comments
      const viewScore = Math.min(views / 1000000, 1) * 4; // Max 4 points for views
      const likeScore = Math.min(likes / 100000, 1) * 3; // Max 3 points for likes
      const commentScore = Math.min(comments / 10000, 1) * 2; // Max 2 points for comments
      const engagementScore = (likes / (likes + dislikes + 1)) * 1; // Max 1 point for engagement ratio

      const reviewPercentage = Math.round((viewScore + likeScore + commentScore + engagementScore) * 10) / 10;

      console.log(`Video: ${item.snippet.title}`);
      console.log(`Views: ${views}, Likes: ${likes}, Dislikes: ${dislikes}, Comments: ${comments}`);
      console.log(`Review Percentage: ${Math.min(reviewPercentage, 10)}/10`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testReviewCalculation();
