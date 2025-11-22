export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Post {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  likes: string[]; // Array of User IDs who liked
  timestamp: number;
}

export type SortOption = 'LATEST' | 'OLDEST' | 'MOST_LIKED';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
