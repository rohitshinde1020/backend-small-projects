import { use, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Message from './components/message'
import Chatbot from './components/chatbot'
import './index.css'
import Sidebar from './components/sidebar'
import { assets } from './assets/assets'
import Credits from './components/credits'
import Loading from './pages/loading'
import './assets/prism.css'
import Community from './pages/community'
import Login from './pages/login'

import { useContext } from 'react'
import { Appcontext } from './context/Appcontext'


function App() {

  const [openmenu, setopenmenu] = useState(false);
  const { pathname } = useLocation();

  const { user } = useContext(Appcontext);

  if (pathname === '/loading') {
    return <Loading />
  }


  return (
    <>
      {!openmenu && <img src={assets.menu_icon} className='absolute top-3 left-3
    w-8 h-8 cursor-pointer md:hidden not-dark:invert' onClick={() => setopenmenu(true)} alt="" />
      }
      {user ? (
        <div className='min-h-screen w-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900
      dark:bg-gradient-to-b dark:from-zinc-600 dark:to-gray-700 dark:text-white'>
          <div className='flex min-h-screen w-screen'>
            <Sidebar openmenu={openmenu} setopenmenu={setopenmenu} />
            <Routes>
              <Route path='/' element={<Chatbot />} />
              <Route path='/message' element={<Message />} />
              <Route path='/credits' element={<Credits />} />
              <Route path='/community' element={<Community />} />

            </Routes>
          </div>
        </div>
      ) : (
        <div>
          {!user && <Login />}
        </div>
      )}




    </>
  )
}

export default App
