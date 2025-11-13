import axios from 'axios';

const API_KEY = 'AIzaSyC6aB2gDD0CTuzok3pggXAhRR9JCNq0IFY';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  rating: number; // calculated rating out of 10
  provider: string;
  category: string;
  aiSummary: string;
  url: string;
}

export const searchYouTubeVideos = async (query: string): Promise<YouTubeVideo[]> => {
  try {
    // First, search for educational videos only (exclude shorts, minimum 20 minutes)
    const educationalQuery = `${query} tutorial course learn programming`;
    const searchResponse = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: educationalQuery,
        type: 'video',
        videoCategoryId: '27', // Education category
        videoDuration: 'long', // Videos longer than 20 minutes
        maxResults: 50, // Increase to allow filtering for unique channels
        key: API_KEY,
      },
    });

    const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId).join(',');

    // Then, get details including statistics
    const detailsResponse = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics',
        id: videoIds,
        key: API_KEY,
      },
    });

    // Filter to unique channels (one video per channel)
    const channelSet = new Set<string>();
    const videos: YouTubeVideo[] = detailsResponse.data.items
      .filter((item: any) => {
        const channelId = item.snippet.channelId;
        if (channelSet.has(channelId)) {
          return false;
        }
        channelSet.add(channelId);
        return true;
      })
      .map((item: any) => {
        const views = parseInt(item.statistics.viewCount) || 0;
        const likes = parseInt(item.statistics.likeCount) || 0;
        const dislikes = parseInt(item.statistics.dislikeCount) || 0;
        const comments = parseInt(item.statistics.commentCount) || 0;

        // Calculate review percentage out of 10 based on views, likes, dislikes, comments
        // Normalize each metric and weight them
        const viewScore = Math.min(views / 1000000, 1) * 4; // Max 4 points for views
        const likeScore = Math.min(likes / 100000, 1) * 3; // Max 3 points for likes
        const commentScore = Math.min(comments / 10000, 1) * 2; // Max 2 points for comments
        const engagementScore = (likes / (likes + dislikes + 1)) * 1; // Max 1 point for engagement ratio

        const reviewPercentage = Math.round((viewScore + likeScore + commentScore + engagementScore) * 10) / 10;

        return {
          id: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          views: formatViews(views),
          rating: Math.min(reviewPercentage, 10), // Cap at 10
          provider: 'YouTube',
          category: 'Education',
          aiSummary: `Learn about ${item.snippet.title} on YouTube.`,
          url: `https://www.youtube.com/watch?v=${item.id}`,
        };
      });

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};

const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};
