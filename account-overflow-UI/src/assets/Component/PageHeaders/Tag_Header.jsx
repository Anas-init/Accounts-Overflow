import React from 'react'


const Tag_Header = () => {
  return (
    <div className='w-full h-max flex flex-col gap-4 justify-center p-3 pt-6'>
     
      <h1 className='w-full font-bold text-3xl' >Tags</h1>
      <div className='w-full text-lg' >A tag is a keyword or label that categorizes your question with other, similar questions. Using the right tags makes it easier for others to find and answer your question.</div>
      <input className='max-[1000px]:w-[40%] max-[600px]:w-[80%] border-2 border-gray-300 px-4 py-1 rounded w-[25%]' placeholder='Filter by tag name' type="text" name="" id="" />

    </div>
  )
}

export default Tag_Header
