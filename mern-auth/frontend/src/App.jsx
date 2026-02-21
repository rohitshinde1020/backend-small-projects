import { useState, useEffect, useContext } from 'react'
import Emailverify from '../pages/Emailverify'
import { Route,Routes } from 'react-router-dom'
import Home from '../pages/home'
import Login from '../pages/login'
import Resetpass from '../pages/resetpass'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Appcontext } from '../context/appcontext'


function App() {
  const { getuserdata, setIsloggedin, userdata } = useContext(Appcontext);

  useEffect(() => {
    getuserdata();
  }, []);

  return (
    <>
      <div>
        <ToastContainer/>
        <Routes>
          
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/email-verify' element={<Emailverify />} />
          <Route path='/resetpass' element={<Resetpass />} />
        </Routes>
      </div>
    </>
  )
}

export default App
