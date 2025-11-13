export interface Resource {
  id: number;
  title: string;
  provider: 'YouTube' | 'Udemy' | 'Coursera' | 'freeCodeCamp';
  url: string;
  rating: number;
  views: string;
  category: 'Web Development' | 'UI/UX Design' | 'Data Science' | 'General';
  thumbnail: string;
  aiSummary: string;
}

export const dummyData: Resource[] = [
  {
    id: 1,
    title: 'Full Modern React Tutorial',
    provider: 'YouTube',
    url: '#',
    rating: 4.9,
    views: '2.1M',
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    aiSummary: 'This resource is highly recommended for its comprehensive coverage of React hooks and modern state management, making it perfect for both beginners and those looking to update their skills.'
  },
  {
    id: 2,
    title: 'Figma for Beginners: UI/UX Design',
    provider: 'Udemy',
    url: '#',
    rating: 4.8,
    views: '890k',
    category: 'UI/UX Design',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    aiSummary: 'A great starting point for aspiring designers. It provides a solid foundation in Figma\'s tools and UI/UX principles through practical, easy-to-follow examples.'
  },
  {
    id: 3,
    title: 'Python for Data Science - Full Course',
    provider: 'freeCodeCamp',
    url: '#',
    rating: 4.9,
    views: '3.5M',
    category: 'Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    aiSummary: 'An extensive, in-depth course that covers all essential Python libraries for data science. Its project-based approach ensures you gain hands-on experience.'
  },
  {
    id: 4,
    title: 'JavaScript Crash Course for Beginners',
    provider: 'YouTube',
    url: '#',
    rating: 4.7,
    views: '5.2M',
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    aiSummary: 'This fast-paced course is excellent for quickly grasping the fundamentals of JavaScript. It is well-structured and covers core concepts effectively.'
  },
  {
    id: 5,
    title: 'Intro to UI/UX: Principles of User Experience',
    provider: 'Coursera',
    url: '#',
    rating: 4.8,
    views: '450k',
    category: 'UI/UX Design',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    aiSummary: 'Offered by a leading university, this course provides a theoretical and research-backed understanding of UX principles, essential for a strong design career.'
  },
    {
    id: 6,
    title: 'Data Analysis with Pandas',
    provider: 'Udemy',
    url: '#',
    rating: 4.7,
    views: '1.1M',
    category: 'Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    aiSummary: 'A practical, hands-on guide to one of the most important data analysis libraries in Python. Great for learners who want to work with real-world datasets.'
  },
  {
    id: 7,
    title: 'HTML & CSS Full Course for Beginners',
    provider: 'freeCodeCamp',
    url: '#',
    rating: 4.8,
    views: '7.8M',
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    aiSummary: 'The definitive starting point for any web developer. This exhaustive course covers everything from the basics to advanced concepts like Flexbox and Grid.'
  },
  {
    id: 8,
    title: 'Advanced Figma: Prototyping and Animations',
    provider: 'YouTube',
    url: '#',
    rating: 4.9,
    views: '760k',
    category: 'UI/UX Design',
    thumbnail: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    aiSummary: 'Takes your Figma skills to the next level. This tutorial is praised for its clear explanations of complex features like Smart Animate and interactive components.'
  }
];