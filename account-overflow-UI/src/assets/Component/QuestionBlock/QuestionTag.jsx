import React, { useState } from 'react'
import Tag from "../Buttons/Tag"
import { NavLink } from 'react-router-dom'

const QuestionTag = ({
    ques = "", 
    tags = "",
    name =""
}) => {

  const [Question, setQuestion] = useState(ques.replace(/["]/g, ''));
  const [Tags, setTags] = useState(tags.replace(/["]/g, '').split(','));
  const [username, setUsername] = useState(name);

  return (
    <div className='w-full flex border-t-2 border-t-gray-300 py-3'>
        
        <div className='w-32 p-2 flex flex-col gap-1 justify-center'>
            {/* <span className='font-semibold'>Views: 0</span>
            <span className='font-semibold'>Votes: 0</span> */}
            <span className='font-semibold'>Answers: 0</span>
        </div>

        <div className='w-full flex flex-col'>
            <span className='p-1'> 
                <span className='font-semibold'>Question: </span> 
                <NavLink  to={"/answer"} state={Question} 
                className='text-blue-400 hover:underline hover:cursor-pointer'> {Question} 
                </NavLink> 
            </span>
            <div className='p-1 w-full'>
                <div className='flex flex-wrap'>
                <span className='font-semibold'>Tags:</span>
                
                {
                    Tags.map((tag) => {
                        return (
                            <Tag tagName={tag} />
                        )
                    })
                }
                
                </div>
                <div> <span className='font-semibold'> Asked By: </span> {username} </div>
            </div>
        </div>

    </div>
  )
}

export default QuestionTag
