import React, {
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, replace, useNavigate } from "react-router";
import { getArticleByAuthor } from "../lib/articles";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiAlertTriangle,
  FiEye,
  FiEdit2,
  FiTrash,
  FiTrash2,
  FiLoader,
} from "react-icons/fi";

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

  /*


    ### `year: 'numeric'`
        This displays the year as a full number.
        - Example: `2023` instead of `'23`

        ### `month: 'long'`
        This displays the full name of the month.
        - Example: `September` instead of `Sep` or `9`

        ### `day: 'numeric'`
        This displays the day of the month as a number without leading zeros.
        - Example: `5` instead of `05`
    */

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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



  // confirm delete
  const confrimDelete = (article) => {
    setArticleToDelete(article);
  };

  // Handle to Delete 

  const HandleDelete = () => {
    if(!articleToDelete) return

    try {
      
    } catch (error) {
      
    }
  }
  const publishedArticles = optimisticArticles.filter(
    (article) => article.published
  );
  const draftArticles = optimisticArticles.filter(
    (article) => !article.published
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white pb-12">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-orange-600 via-orange-500 to-amber-500 text-white">
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
            {/* Pubblished articles section  */}
            <div>
              <h2 classNam="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span>Published Articles</span>e
                {publishedArticles.length > 0 && (
                  <span className="ml-3 px-2.5 py-0.5 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {publishedArticles.length}
                  </span>
                )}
              </h2>

              {publishedArticles.length > 0 ? (
                <div className="bg-white rounded-xl overflow-hidden shadow-md">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 ">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Title
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            comments
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {publishedArticles.map((article) => (
                          <tr key={article.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-9000 truncate max-w-xs">
                                {article.title}
                              </div>
                            </td>
                            {/* date */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {formatDate(article.created_at)}
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap ">
                              <div className="text-sm text-gray-500 ">
                                {article.comments?.count?.length || 0}
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex justify-end space-x-2">
                                <Link
                                  to={`/article/${article.id}`}
                                  className="p-2 text-indigo-600 hover:text-orange-800 rounded-full hover:bg-blue-50"
                                  title="View Article"
                                >
                                  <FiEye />
                                </Link>
                                <Link
                                  to={`/editor/${article.id}`}
                                  className="p-2 text-orange-600 hover:text-orange-800 rounded-full hover:bg-blue-50"
                                  title="Edit Article"
                                >
                                  <FiEdit2 />
                                </Link>

                                <button
                                  onClick={() => confrimDelete(article)}
                                  className="p-2 text-red-600 hover:text-red-800 rounded-full cursor-pointer hover:bg-blue-50"
                                  title="Delete Article"
                                >
                                  <FiTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                "No article found"
              )}
            </div>
          </div>
        )}{" "}
      </div>
      {/* delete confrimation modal */}
      {articleToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "
              {articleToDelete.title || "Untitled Article"}"? This action cannot
              be undone.
              <div className="flex justify-center space-x-3 mt-2">
                <button
                  // onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-100 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  cancel
                </button>

                <button
                  // onClick={HandleDelete}
                  // disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="mr-2" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageArticalePage;
