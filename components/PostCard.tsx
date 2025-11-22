import React, { useState } from 'react';
import { Post, User } from '../types';
import { Heart, Trash2, Edit2, Clock, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onEdit: (postId: string, newContent: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onLike, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const isLiked = post.likes.includes(currentUser.id);
  const isAuthor = post.userId === currentUser.id;

  const handleSaveEdit = () => {
    if (editContent.trim() !== post.content) {
      onEdit(post.id, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-4 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-600"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{post.authorName}</h3>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {formatDistanceToNow(post.timestamp, { addSuffix: true })}
            </div>
          </div>
        </div>

        {isAuthor && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
              title="Edit Post"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                 if(window.confirm("Are you sure you want to delete this post?")) {
                     onDelete(post.id)
                 }
              }}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              title="Delete Post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
              rows={3}
            />
            <div className="flex justify-end space-x-2">
               <button
                onClick={handleCancelEdit}
                className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-3 h-3 mr-1" /> Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              >
                <Check className="w-3 h-3 mr-1" /> Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        )}
      </div>

      {/* Image Attachment */}
      {post.imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
          <img
            src={post.imageUrl}
            alt="Post attachment"
            className="w-full h-auto max-h-96 object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Footer / Actions */}
      <div className="flex items-center pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center space-x-2 group transition-all ${
            isLiked 
              ? 'text-pink-500' 
              : 'text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400'
          }`}
        >
          <div className={`p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-colors ${isLiked ? 'bg-pink-50 dark:bg-pink-900/20' : ''}`}>
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </div>
          <span className={`font-medium ${isLiked ? 'text-pink-600 dark:text-pink-400' : ''}`}>
            {post.likes.length}
          </span>
        </button>
      </div>
    </div>
  );
};