import React from 'react'
import { Link } from 'react-router'

const Header = () => {
  return (
    <header className='bg-white shadow'>
        <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8'>

        {/* left and right */}
          <div className='flex justify-between h-16'>

            {/* left  */}
            <div className='flex'>

                {/* logo */}
                <div className='shrink-0 flex items-center'>
                <Link to='/' className='text-2xl text-orange-600 font-bold'>Blogify</Link>
                </div>

                {/* nav */}
                <nav className='hidden sm:ml-6 sm:flex sm:space-x-6'>
                    <Link to='/' className='inline-flex items-center px-1 pt-1 border-b-2 border-orange-500 text-sm font-medium text-gray-900'>Home</Link>

                    <Link to='/articles' className='inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900'>Articles</Link>

                    <Link to='/write' className='inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900'>write</Link>

                    <Link to='/myarticle' className='inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900'>My Article</Link>

                    <Link to='/' className='inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-900'>Articles</Link>
                </nav>
            </div>
            {/* Right */}
            <div>
                <div>
                    <span>heloo, ShehabEldin</span>
                </div>
                <div>
                    <button></button>
                </div>
            </div>
          </div>
        </div>
    </header>
  )
}

export default Header