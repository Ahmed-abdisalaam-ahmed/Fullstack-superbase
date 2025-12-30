import React, {
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router";
import { getArticleByAuthor } from "../lib/articles";
import toast from "react-hot-toast";
import { FiPlus, FiAlertTriangle } from "react-icons/fi";

const ManageArticalePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();

  // waxay ku control kartaa in aad update gareysid UI
  const [optimisticArticles, updateOptimisticArticles] = useOptimistic(
    articles,
    (state, articlesToRemove) =>
      state.filter((article) => article.id !== articlesToRemove)
  );

  useEffect(() => {
    if (user) {
      fetchUserArticles();
    } else {
      navigate("/signin");
    }
  }, [user]);

  const fetchUserArticles = async () => {
    try {
      setLoading(true);
      const { articles, count } = await getArticleByAuthor(user.id, {
        includeUnPublished: true,
        limit: 100,
      });
      setArticles(articles);
      setTotalCount(count);

      console.log("articles", articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to load your articles. Please try again.");
      toast.error("Failed to load your articles");
    } finally {
      setLoading(false);
    }
  };

  const publishedArticles = optimisticArticles.filter(
    (article) => article.published
  );
  const draftArticles = optimisticArticles.filter(
    (article) => !article.published
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Manage Your Articles</h1>
              <p className="text-orange-100">
                Create, edit, and manage your published and draft articles
              </p>
            </div>
            <Link
              to="/editor"
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white text-orange-600 rounded-xl shadow-md hover:bg-orange-50 transition-colors duration-200"
            >
              <FiPlus className="mr-2" />
              Create New Article
            </Link>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <FiAlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">{error}</h3>
            <button
              onClick={fetchUserArticles}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : optimisticArticles.length === 0 ? (
          <div className="bg-white border border-dashed border-orange-200 rounded-xl p-8 text-center">
            <h3 className="text-lg font-semibold mb-2 text-orange-700">
              No articles yet
            </h3>
            <p className="text-orange-500 mb-4">
              You haven't created any articles. Click below to create your first
              article.
            </p>
            <Link
              to="/editor"
              className="inline-flex items-center px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
            >
              <FiPlus className="mr-2" />
              Create Article
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span>Published Articles</span>
                {publishedArticles.length > 0 && (
                  <span className="ml-3 px-2.5 py-0.5 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {publishedArticles.length}
                  </span>
                )}
              </h2>


              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageArticalePage;
