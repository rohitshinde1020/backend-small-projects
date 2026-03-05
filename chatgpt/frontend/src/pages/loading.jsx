import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loading = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        },6800);
        return () => clearTimeout(timer);
    }, [navigate])
    
    return (
        <div className='relative flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900'>
    
            <div className='relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 shadow-2xl shadow-black/40 backdrop-blur'>
                <div className='relative h-12 w-12'>
                    <div className='absolute inset-0 rounded-full border-4 border-white/30' />
                    <div className='absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin' />
                </div>
                <div>
                    <p className='text-sm uppercase tracking-[0.2em] text-white/60'>Booting</p>
                    <p className='text-lg font-semibold text-white'>Preparing your chat...</p>
                </div>
            </div>
        </div>
    )
}

export default Loading
