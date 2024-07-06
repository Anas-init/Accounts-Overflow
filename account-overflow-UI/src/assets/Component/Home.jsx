import React from 'react'
import Header from "./Header"
import QuestionTag from "./QuestionTag"

const Home = () => {
  return (
    <div className='max-[980px]:w-full max-[600px]:left-0 max-[600px]:z-10 flex w-[84.%] h-max relative left-52 overflow-x-hidden overflow-y-scroll top-[3.95rem] max-[600px]:top-[12.1rem] mb=5'>
      
      <div className='h-max w-[58%] max-[980px]:w-full  scrollbar-track-orange-600'>
        <Header heading="Top Questions" btnText="Ask Question" />
        <QuestionTag/>
        <QuestionTag/>
        <QuestionTag/>
        <QuestionTag/>
        <QuestionTag/>
        <QuestionTag/>
        <QuestionTag/>
      </div>
      
      <div className='border-2 border-cyan-800 max-[980px]:hidden'>
        Useless Box
      </div>
    
    </div>
  )
}

export default Home
