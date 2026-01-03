import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../lib/superbase";
import { FiEdit2, FiMessageSquare, FiSend, FiTrash2 } from "react-icons/fi";
import { data, Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

const CommentSection = ({ articleId }) => {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const commentInputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const content = newComment.trim();

    if (content || !user) {
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
            avatar_url: profile.avatar_url,
          },
          isOptimistic: true,
        };

        setComments((prev) => [optinicticComment, ...prev]);

        // TODO: save to the database

        const { data, error } = await supabase
          .from("comments")
          .insert({ content, article_id: articleId, user_id: user.id });
        // .select('content, article_id ,user_id')
        // .single();

        if (error) throw error;
        if (data) {
          console.log("comment data info ", data);
        }
      } catch (error) {}
    }
  };

  // console.log("user info", user)
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(
          `*,
            user:user_id (id, username, avatar_url)
          `
        )
        .eq("article_id", articleId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // log initial
    fetchComments();

    const verifySupabaseRealTime = async () => {
      try {
        // list all current channels

        const channels = supabase.getChannels();
        console.log("current active avaible", channels.length);

        // check database connection

        const { data, error } = await supabase
          .from("comments")
          .select("count")
          .eq("article_id", articleId);

        if (error) {
          console.error("Error connecting to Supabase:", error);
        } else {
          console.log(
            "Connected to Supabase successfully, comment count:",
            data
          );
        }
      } catch (error) {
        console.error("Error verifying Supabase configuration:", error);
      }
    };
    verifySupabaseRealTime();

    // clean up any existing subscription first
    supabase.getChannels().forEach((channel) => {
      console.log("Found channel: ", channel.topic);
      supabase.removeChannel(channel);
    });

    // use single channel with multiple handlers

    const commentChannel = supabase
      .channel("comments-" + articleId)

      // listen to insert = dhageyso isbadalada
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `article_id=eq.${articleId}`,
        },
        (payload) => {
          console.log("insert Event recevied: ", payload);
          fetchComments();
        }
      )

      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "comments",
        },

        (payload) => {
          console.log("DELETE event without filter recevied: ", payload);
          console.log("UNFILTERED DELETE payload.old: ", payload.old);

          // For DELETE events, we only get the id in payload.old
          // We need to handle this case specially
          // waxaynu ka helaynaa Delete events, kaliya id-gaas ku dhex jira payload.old
          // markaa waxaynu u baahanhay inay u qaabayno si hagaagsan case-kan

          if (payload.old && payload.old.id) {
            // Instead of checking article_id which is not included in the payload for DELETE events,
            // we need to check if the deleted comment ID exists in our current comments

            setComments((current) => {
              // check if the comment exist
              const commentExist = current.some(
                (comment) => comment.id === payload.old.id
              );

              if (commentExist) {
                console.log(
                  "UNFILTERED: Removing deleted comment with ID:",
                  payload.old.id
                );
                const filteredComments = current.filter((comment) => comment.id !== payload.old.id);
                console.log( `UNFILTERED: Comments before: ${current.length}, after: ${filteredComments.length}`);
                return filteredComments;
              } else {
                console.log("UNFILTERED: Comment ID not found in current state:",payload.old.id);
                return current;
              }
            });
          }
        }
      )

      .subscribe((status) => {
        console.log("subsciption status", status);
      });

    return () => {
      console.log("Clean up channel subsciption");
      supabase.removeChannel(commentChannel);
    };
  }, [articleId]);

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to Delete this comments"))
      return;

    try {
      setComments((current) => {
        const filteredComments = current.filter(
          (comment) => comment.id !== commentId
        );
        return filteredComments;
      });

      const { data, count, error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .select();

      console.log("Comment deleted successfully from database:", {count,data,});
      console.log("========= COMMENT DELETION COMPLETE =========");
      toast.success("========= COMMENT DELETION COMPLETE =========");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
      fetchComments();
    }
  };

  return (
    <div className="mt-10 bg-white p-5 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-5">
        <FiMessageSquare className="text-gray-500 text-lg" />
        <h2 className="text-xl font-medium text-gray-700">
          Comments ({comments.length})
        </h2>

        {!user && (
          <button
            // onClick={}
            className='className="ml-auto px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"'
          >
            join discussion
          </button>
        )}
      </div>
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <img
              src={profile?.avatar_url || "User"}
              alt={profile?.username || "You"}
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
                  {submitting ? "Posting..." : "Post Comment"}
                  <FiSend
                    className={submitting ? "opacity-0" : "opacity-100"}
                  />
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <h3 className="text-base font-medium text-gray-700 mb-2">
            Join the conversation
          </h3>
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
      )}

      {/* comments List */}

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
          {comments.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FiMessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-base">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className={`border border-gray-200 p-4 rounded-lg ${
                  comment.isOptimistic ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={
                      comment.user?.avatar_url ||
                      `https://ui-avatars.com/api/?name=${
                        comment.user?.username || "User"
                      }`
                    }
                    alt={comment.user?.username || "User"}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1 flex-wrap">
                      {/* user Profile */}
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="font-medium text-gray-800">
                          {comment.user?.username || "User"}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatDistanceToNow(new Date(comment.created_at))}
                        </span>
                        {comment.isOptimistic && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            Posting...
                          </span>
                        )}
                      </div>

                      {/* actions */}
                      {user &&
                        user.id === comment.user.id &&
                        !comment.isOptimistic && (
                          <div className="flex space-x-2">
                            <button
                              // onClick={() => handleEdit(comment)}
                              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                              aria-label="Edit comment"
                            >
                              <FiEdit2 className="w-3.5 h-3.5" />
                              <span className="text-xs">Edit</span>
                            </button>

                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                              aria-label="Delete comment"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                              <span className="text-xs">Delete</span>
                            </button>
                          </div>
                        )}
                    </div>

                    {/* comments content  */}

                    {/* TODO: Area to Edit */}
                    <p className="text-gray-700 whitespace-pre-line text-sm mt-1">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
