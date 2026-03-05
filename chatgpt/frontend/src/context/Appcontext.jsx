import React, { useEffect } from 'react'
import { createContext } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyChats, dummyUserData } from '../assets/assets';

export const Appcontext=createContext();
const Appcontextprovider = ({children}) => {

    const navigate=useNavigate();
    const [user,setuser]=useState([]);
    const [theme,settheme]=useState(localStorage.getItem('theme') || 'light');
    const [chat,setchat]=useState([]);
    const [selectedchat,setselectedchat]=useState(null);

    const fetchuser=async()=>{
        setuser(dummyUserData);
    }

    const fetchchat=async()=>{
        setchat(dummyChats);
        setselectedchat(dummyChats[0]);
    }

    useEffect(()=>{
        if(theme==='dark'){
            document.documentElement.classList.add('dark');
        }
        else{
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme',theme);
    },[theme])

    useEffect(()=>{
        if(user){
            fetchchat();
        }
        else{
            setchat([]);
            setselectedchat(null);
        }
        
    },[user])

    useEffect(()=>{
        fetchuser();
    },[])

    const value={
        user,
        theme,
        chat,
        selectedchat,
        setselectedchat,
        setchat,
        settheme,
        fetchuser,
        navigate
    }


  return (
    <div>
        <Appcontext.Provider value={value}>
            {children}
        </Appcontext.Provider>
      
    </div>
  )
}

export default Appcontextprovider
