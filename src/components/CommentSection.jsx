import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/superbase';
import { FiMessageSquare, FiSend } from 'react-icons/fi';
import { data, Link } from 'react-router';

const CommentSection = ({articleId}) => {
    const { user, profile } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const commentInputRef = useRef(null);

    const handleSubmit = async (event) => {
      event.preventDefault();

      const content = newComment.trim();

      if(content || !user) {
        try {


          // simple optimistic update = add temp comment at the top

          const optinicticComment = {
            id: `temp=${Date.now()}`,
            content,
            created_at: new Date().toISOString(),
            user_id: user.id,
            user: {
              id: user.id,
              username: user.username,
              avatar_url: profile.avatar_url
            },
            isOptimistic: true
          }

          setComments((prev => [optinicticComment, ...prev]))

          // TODO: save to the database

         const {data ,error} = await supabase.from('comments')
                .insert({content, article_id: articleId, user_id: user.id})
                // .select('content, article_id ,user_id')
                // .single();


          if(error) throw error
          if(data){
            console.log("comment data info " , data);
          }
          

        } catch (error) {
          
        }
      }
    }

    // console.log("user info", user)

    const fetchComments = async () => {
      try {
        const {data , error} = await supabase
              .from('comments')
              .select(`*,
                  user:userId (id , username , avatar_url)
                `) 
              .eq('article_id' ,articleId)
              .order('created_at', { ascending: false });

        if(error) throw error 
        setComments(data || [])     
      } catch (error) {
        console.error('Error fetching comments: ', error)
      }finally{
        setLoading(false)
      }
    }


  return (
    <div className='mt-10 bg-white p-5 rounded-lg border border-gray-200'>
        <div className='flex items-center gap-2 mb-5'>
           <FiMessageSquare className="text-gray-500 text-lg" />
            <h2 className="text-xl font-medium text-gray-700">Comments ({comments.length})</h2>

            {!user && (
              <button 
              // onClick={}
              className='className="ml-auto px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"'>
                  join discussion 
              </button>
            )}
        </div>
        {user ? (
            <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex gap-3">
                        <img
                            src={profile?.avatar_url || 'User'}
                            alt={profile?.username || 'You'}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200 self-start mt-1"
                        />

                        <div className="flex-1">
                            <textarea
                                ref={commentInputRef}
                                className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-700 min-h-[100px]"
                                placeholder="Share your thoughts..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                disabled={submitting}
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                                // disabled={submitting || !newComment.trim()}
                                >
                                    {submitting ? 'Posting...' : 'Post Comment'}
                                    <FiSend className={submitting ? 'opacity-0' : 'opacity-100'} />
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <h3 className="text-base font-medium text-gray-700 mb-2">Join the conversation</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                        Sign in to comment on this article.
                    </p>


                    <div className="flex gap-3">
                        <Link
                            to="/signin"
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                            Create account
                        </Link>
                    </div>
                </div>
          )
        }

        {/* comments List */}

        
    </div>
  )
}

export default CommentSection