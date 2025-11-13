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
    // Expand search for long-format educational content
    const educationalQuery = `${query} how to learning educational skills tutorial tips and tricks study course guide step-by-step in-depth explanation training walkthrough project-based learning masterclass lesson workshop demonstration full class lecture practical implementation concept explanation practice session complete series fundamentals basics advanced technical training`;
    const searchResponse = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: educationalQuery,
        type: 'video',
        maxResults: 50, // Fetch more to allow broader selection
        key: API_KEY,
      },
    });

    const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId).join(',');

    // Get details including statistics and content details for duration
    const detailsResponse = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoIds,
        key: API_KEY,
      },
    });

    // Map videos without strict filtering, but ensure some educational relevance
    const videos: YouTubeVideo[] = detailsResponse.data.items
      .filter((item: any) => {
        // Prioritize long-format videos (10 minutes or more) and ensure educational relevance
        const duration = item.contentDetails?.duration || '';
        const minutes = parseDuration(duration);
        const title = item.snippet.title.toLowerCase();
        const description = item.snippet.description.toLowerCase();
        const educationalKeywords = ['how to', 'learning', 'educational', 'skills', 'tutorial', 'tips and tricks', 'study', 'course', 'guide', 'step-by-step', 'in-depth explanation', 'training', 'walkthrough', 'project-based learning', 'masterclass', 'lesson', 'workshop', 'demonstration', 'full class', 'lecture', 'practical implementation', 'concept explanation', 'practice session', 'complete series', 'fundamentals', 'basics', 'advanced', 'technical training'];
        const hasEducationalKeyword = educationalKeywords.some(keyword =>
          title.includes(keyword) || description.includes(keyword)
        );
        // Exclude Shorts, music videos, vlogs, entertainment, news
        const excludeKeywords = ['shorts', 'music', 'vlog', 'entertainment', 'news', 'song', 'live', 'interview'];
        const isExcluded = excludeKeywords.some(keyword =>
          title.includes(keyword) || description.includes(keyword)
        );
        return hasEducationalKeyword && !isExcluded;
      })
      .map((item: any) => {
        const views = parseInt(item.statistics.viewCount) || 0;
        const likes = parseInt(item.statistics.likeCount) || 0;
        const dislikes = parseInt(item.statistics.dislikeCount) || 0;
        const comments = parseInt(item.statistics.commentCount) || 0;

        // Calculate rating based on engagement
        const viewScore = Math.min(views / 1000000, 1) * 4;
        const likeScore = Math.min(likes / 100000, 1) * 3;
        const commentScore = Math.min(comments / 10000, 1) * 2;
        const engagementScore = (likes / (likes + dislikes + 1)) * 1;

        const reviewPercentage = Math.round((viewScore + likeScore + commentScore + engagementScore) * 10) / 10;

        return {
          id: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          views: formatViews(views),
          rating: Math.min(reviewPercentage, 10),
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

const parseDuration = (duration: string): number => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0') || 0;
  const minutes = parseInt(match[2] || '0') || 0;
  const seconds = parseInt(match[3] || '0') || 0;
  return hours * 60 + minutes + seconds / 60;
};
