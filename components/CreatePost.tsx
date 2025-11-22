import React, { useState } from 'react';
import { User } from '../types';
import { Image as ImageIcon, Send, Sparkles, Loader2, X } from 'lucide-react';
import { generatePostContent, improvePostGrammar } from '../services/geminiService';

interface CreatePostProps {
  currentUser: User;
  onPost: (content: string, imageUrl?: string) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onPost }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePost = () => {
    if (!content.trim()) return;
    onPost(content, imageUrl);
    setContent('');
    setImageUrl('');
    setShowImageInput(false);
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      if (content.length > 10) {
        // Improve existing text
        const improved = await improvePostGrammar(content);
        setContent(improved);
      } else {
        // Generate new based on topic
        const topic = content || "a beautiful day";
        const generated = await generatePostContent(topic);
        setContent(generated);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6 transition-colors duration-300">
      <div className="flex space-x-4">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
        />
        <div className="flex-1 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
            className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg p-3 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 resize-none transition-all"
            rows={3}
          />
          
          {showImageInput && (
            <div className="relative flex items-center animation-fade-in">
               <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL here (https://...)"
                className="w-full text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500 dark:text-gray-300"
              />
              <button 
                onClick={() => { setShowImageInput(false); setImageUrl(''); }}
                className="absolute right-2 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {imageUrl && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowImageInput(!showImageInput)}
                className={`p-2 rounded-full transition-colors flex items-center gap-2 text-sm font-medium ${showImageInput ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'}`}
              >
                <ImageIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Photo</span>
              </button>
              
              <button
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="p-2 rounded-full text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/30 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                <span className="hidden sm:inline">AI Assist</span>
              </button>
            </div>

            <button
              onClick={handlePost}
              disabled={!content.trim() && !imageUrl}
              className="bg-primary-600 text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>Post</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};