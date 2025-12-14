import { Route, Routes } from 'react-router'
import './App.css'
import ArticlesPage from './Pages/ArticlesPage'
import ArticlePage from './Pages/ArticlePage'
import SignInPage from './Pages/SignInPage'
import SignUpPage from './Pages/SignUpPage'
import Homepage from './Pages/Homepage'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {

  return (
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
            <Route path='/signin' element={<SignInPage />}/>
            <Route path='/signup' element={<SignUpPage />}/>
        </Routes> 
      </main>
      {/* footer */}
      <Footer />
    </div>
  )
}

export default App
