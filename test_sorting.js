import axios from 'axios';

const API_KEY = 'AIzaSyC6aB2gDD0CTuzok3pggXAhRR9JCNq0IFY';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

async function testSorting() {
  try {
    // First, search for educational videos only
    const searchResponse = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: 'javascript',
        type: 'video',
        videoCategoryId: '27', // Education category
        maxResults: 10,
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
      .map((item) => {
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

        return {
          id: item.id,
          title: item.snippet.title,
          views: formatViews(views),
          reviewPercentage: Math.min(reviewPercentage, 10),
        };
      });

    // Sort videos by review percentage descending, then by views descending
    const sortedVideos = [...videos].sort((a, b) => {
      const reviewA = a.reviewPercentage || 0;
      const reviewB = b.reviewPercentage || 0;
      if (reviewB !== reviewA) {
        return reviewB - reviewA;
      }
      const viewsA = parseViews(a.views);
      const viewsB = parseViews(b.views);
      return viewsB - viewsA;
    });

    console.log('Videos sorted by review percentage:');
    sortedVideos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title} - Review: ${video.reviewPercentage}/10, Views: ${video.views}`);
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

const parseViews = (views) => {
  const match = views.match(/(\d+(?:\.\d+)?)([KM]?)/);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = match[2];
  if (unit === 'K') return num * 1000;
  if (unit === 'M') return num * 1000000;
  return num;
};

testSorting();
