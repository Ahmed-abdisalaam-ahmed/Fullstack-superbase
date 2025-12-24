import { Route, Routes } from 'react-router'
import ArticlesPage from './Pages/ArticlesPage'
import ArticlePage from './Pages/ArticlePage'
import SignInPage from './Pages/SignInPage'
import SignUpPage from './Pages/SignUpPage'
import Homepage from './Pages/Homepage'
import Header from './components/Header'
import Footer from './components/Footer'
import { AuthProvider } from './contexts/AuthContext'
import UnAuthenticatedRoute from './components/UnAuthenticatedRoute'
import ArticleEditorPage from './Pages/ArticleEditorPage'
import ManageArticalePage from './Pages/ManageArticalePage'
import ProfilePage from './Pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <AuthProvider>
      <div>
        {/* header */}
        <Header />
        <main>
          {/* routes */}
          <Routes>
              <Route path='/' element={<Homepage />}/>
              <Route path='/articles' element={<ArticlesPage />}/>
              <Route path='/article/:id' element={<ArticlePage />}/>

              {/* unauthenticated routes (redirect to home if logging in ) */}
              <Route path='/signin' element={
                <UnAuthenticatedRoute>
                  <SignInPage />
                </UnAuthenticatedRoute>
                }/>
              <Route path='/signup' element={
                <UnAuthenticatedRoute>
                  <SignUpPage />
                </UnAuthenticatedRoute>
                }/>

                {/* Protected router  */}
                <Route path='/editor' element={
                  <ProtectedRoute>
                    <ArticleEditorPage/>
                  </ProtectedRoute>
                }/>
                <Route path='/editor/:id' element={
                  <ProtectedRoute>
                    <ArticleEditorPage/>
                  </ProtectedRoute>
                }/>
                <Route path='/manage-article' element={
                  <ProtectedRoute>
                    <ManageArticalePage/>
                  </ProtectedRoute>
                }/>
                <Route path='/profile' element={
                  <ProtectedRoute>
                    <ProfilePage/>
                  </ProtectedRoute>
                }/>

          </Routes> 
        </main>
        {/* footer */}
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
