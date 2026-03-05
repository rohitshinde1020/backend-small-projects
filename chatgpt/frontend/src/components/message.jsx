import moment from 'moment'
import React, { useEffect } from 'react'
import Markdown from 'react-markdown'
import Prism from 'prismjs'


const Message = ({ message }) => {

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content])

  return (
    <div className='w-full'>
      {message.role === 'user' ? (
        <div className='flex items-end justify-end my-4 gap-3'>
          <div className='flex flex-col gap-2 max-w-[78%] md:max-w-2xl'>
            <div className='rounded-2xl rounded-br-sm bg-gradient-to-br from-blue-600 to-indigo-600 px-4 py-3 text-white shadow-lg'>
              <p className='text-sm leading-relaxed'>{message.content}</p>
            </div>
            <span className='text-[11px] text-gray-500 text-right'>{moment(message.timestamp).fromNow()}</span>
          </div>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-semibold shadow'>
            U
          </div>
        </div>
      ) : (
        <div className='flex items-end justify-start my-4 gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-semibold shadow dark:bg-white dark:text-slate-900'>
            AI
          </div>
          <div className='flex flex-col gap-2 max-w-[78%] md:max-w-2xl'>
            <div className='rounded-2xl rounded-bl-sm bg-white/90 px-4 py-3 text-slate-900 shadow-lg ring-1 ring-slate-200
              dark:bg-slate-800/80 dark:text-slate-100 dark:ring-slate-700/60'>
              {message.isImage ? (
                <img src={message.content} alt="" className='w-full max-w-md rounded-lg' />
              ) : (
                <p className='text-sm leading-relaxed reset-tw text-wrap'>
                  <Markdown>{message.content}</Markdown>
                </p>
              )}
            </div>
            <span className='text-[11px] text-gray-500 dark:text-gray-400'>{moment(message.timestamp).fromNow()}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Message
