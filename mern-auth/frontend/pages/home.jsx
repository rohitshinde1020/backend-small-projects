import React from 'react'
import Navbar from '../components/navbar'
import Header from '../components/header'

const Home = () => {
  return (
    <div className='flex flex-col   w-full min-h-screen'>
      <Navbar/>
      <Header/>
    </div>
  )
}

export default Home
