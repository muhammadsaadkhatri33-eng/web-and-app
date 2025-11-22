import React, { useState, useEffect, useMemo } from 'react';
import { User, Post, SortOption } from './types';
import { Auth } from './components/Auth';
import { CreatePost } from './components/CreatePost';
import { PostCard } from './components/PostCard';
import { v4 as uuidv4 } from 'uuid';
import { Sun, Moon, LogOut, Search, Filter } from 'lucide-react';

const STORAGE_KEY_USER = 'socialspark_user';
const STORAGE_KEY_POSTS = 'socialspark_posts';
const STORAGE_KEY_THEME = 'socialspark_theme';

// Initial dummy data to populate if empty
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    userId: 'demo',
    authorName: 'Sarah Connor',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    content: 'Just finished my first coding project! 🚀 #coding #webdev',
    likes: ['demo', 'test'],
    timestamp: Date.now() - 10000000,
    imageUrl: 'https://picsum.photos/800/400'
  },
  {
    id: '2',
    userId: 'john',
    authorName: 'John Doe',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    content: 'Does anyone know a good React tutorial? 🤔',
    likes: [],
    timestamp: Date.now() - 5000000
  }
];

function App() {
  // -- State --
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('LATEST');
  const [isInitialized, setIsInitialized] = useState(false);

  // -- Effects --

  // Initialize App
  useEffect(() => {
    // Load Theme
    const storedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load User
    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load Posts
    const storedPosts = localStorage.getItem(STORAGE_KEY_POSTS);
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      setPosts(INITIAL_POSTS);
    }

    setIsInitialized(true);
  }, []);

  // Persistence Effects
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  }, [posts, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user, isInitialized]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);


  // -- Handlers --

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleCreatePost = (content: string, imageUrl?: string) => {
    if (!user) return;
    const newPost: Post = {
      id: uuidv4(),
      userId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      content,
      imageUrl,
      likes: [],
      timestamp: Date.now()
    };
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const handleLikePost = (postId: string) => {
    if (!user) return;
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(user.id);
        return {
          ...post,
          likes: isLiked 
            ? post.likes.filter(id => id !== user.id) 
            : [...post.likes, user.id]
        };
      }
      return post;
    }));
  };

  const handleEditPost = (postId: string, newContent: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, content: newContent } : post
    ));
  };

  // -- Computed --

  const processedPosts = useMemo(() => {
    let filtered = posts.filter(post => 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'LATEST': return b.timestamp - a.timestamp;
        case 'OLDEST': return a.timestamp - b.timestamp;
        case 'MOST_LIKED': return b.likes.length - a.likes.length;
        default: return 0;
      }
    });
  }, [posts, searchQuery, sortBy]);


  // -- Render --

  if (!isInitialized) return null;

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            SocialSpark
          </h1>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1.5">
               <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full" />
               <span className="text-sm font-medium hidden sm:block text-gray-700 dark:text-gray-200">{user.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        
        <CreatePost currentUser={user} onPost={handleCreatePost} />

        {/* Feed Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 sticky top-20 z-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            />
          </div>

          <div className="relative">
             <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <Filter className="w-4 h-4" />
             </div>
             <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none pl-10 pr-8 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:ring-2 focus:ring-primary-500 shadow-sm cursor-pointer text-gray-700 dark:text-gray-200 font-medium w-full sm:w-auto"
             >
               <option value="LATEST">Latest First</option>
               <option value="OLDEST">Oldest First</option>
               <option value="MOST_LIKED">Most Liked</option>
             </select>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {processedPosts.length > 0 ? (
            processedPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={user}
                onLike={handleLikePost}
                onDelete={handleDeletePost}
                onEdit={handleEditPost}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No posts found. Why not start the conversation?</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;