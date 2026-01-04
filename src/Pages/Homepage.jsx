import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi'
import { Link } from 'react-router'
import supabase from '../lib/superbase'
import ArticleCard from '../components/ArticleCard'

const Homepage = () => {

  const [featuredArticles, setFeaturedArticles] = useState([])
  const [latestArticle, setLatestArticles] = useState([])
  const [loading, setLoading] = useState(false)

  // limit = intaugu yar soo akhri
  useEffect(() => {
    fetchArticles();
  }, [])
  
  const fetchArticles = async () => {

    try {
      setLoading(true)

      // Fetch featured articles (articles with most likes)
      const { data: featured, error: featuredError } = await supabase
        .from('articles')
        .select(`
          *,
          author:author_id (
            username,
            avatar_url
          )
        `)
        .eq('published', true)
        .limit(3)

      if (featuredError) throw featuredError

      // Fetch latest articles
      const { data: latest, error: latestError } = await supabase
        .from('articles')
        .select(`
          *,
          author:author_id (
            username,
            avatar_url
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (latestError) throw latestError

      console.log("latest", latest)

      setFeaturedArticles(featured || [])
      setLatestArticles(latest || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
      toast.error('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  if(loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500'>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* hero section */}
      <div className='relative bg-linear-to-r from-orange-600 to-orange-500 overflow-hidden'>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32'>
             <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Welcome to Our Blog
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-2xl mx-auto mb-8">
              Discover insightful articles, tutorials, and stories from our community of developers and designers.
            </p>
            <Link
              to="/articles"
              className="inline-flex items-center px-8 py-4 rounded-full bg-white text-orange-600 font-semibold hover:bg-orange-50 transition-colors duration-200"
            >
              Browse All Articles
              <FiArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Articles section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='flex items-center justify-between mb-8'>
          <div className="flex items-center space-x-2">
            <FiTrendingUp className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
          </div>
          <Link
            to="/articles"
            className="text-orange-600 hover:text-orange-700 font-medium flex items-center"
          >
            View all
            <FiArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className='space-y-8'>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map(article => (
              <ArticleCard article={article} />
            ))}
          </div>
                    <div className='flex items-center justify-between mb-8'>
            <div className="flex items-center space-x-2">
              <FiTrendingUp className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            </div>
            <Link
              to="/articles"
              className="text-orange-600 hover:text-orange-700 font-medium flex items-center"
            >
              View all
              <FiArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestArticle.map(article => (
              <ArticleCard article={article} />
            ))}
          </div>
        </div>
      </div>

      {/* contant section */}
      <div className='bg-black py-6 sm:py-8'>

        <div className='max-w-6xl h-[300px] mx-auto bg-linear-to-r from-orange-600 to-orange-500 rounded-lg p-4'>
           <div className='p-4 space-y-3'>
              <h2 className='text-4xl font-bold text-gray-200'>Stay updated</h2>
              <p className='text-xl text-gray-100'>Subscribe to our newsletter to receive the articles, tutorials, and updates directly in your inbox
              </p>
           </div>
           <div className='flex justify-around'>
              <input type="text" className='mt-1 w-[600px] block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm bg-gray-200' placeholder='Enter your Email'/>
               <button className='bg-white font-bold p-4 text-orange-600 hover:transition-button hover:ease-in-out duration-200 shadow-sm cursor-pointer rounded-lg'>Subscribe</button>
           </div>

        </div>

      </div>



    </div>
  )
}

export default Homepage