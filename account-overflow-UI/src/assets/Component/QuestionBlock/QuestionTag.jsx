import React from 'react'
import Tag from "../Buttons/Tag"
const QuestionTag = () => {
  return (
    <div className='w-full flex border-t-2 border-t-gray-300 py-3'>
        
        <div className='w-32 p-2 flex flex-col gap-1 justify-center'>
            <span className='font-semibold'>Views: 0</span>
            <span className='font-semibold'>Votes: 0</span>
            <span className='font-semibold'>Answers: 0</span>
        </div>

        <div className='w-full flex flex-col'>
            <span className='p-1'> 
                <span className='font-semibold'>Question: </span> 
                <span className='text-blue-400 hover:underline hover:cursor-pointer'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit atque repudiandae delectus rem voluptatem neque dolores, cum totam hic illo incidunt harum corporis, non asperiores nam accusantium reiciendis, nulla vitae? Laboriosam molestiae inventore dolorem quia accusantium assumenda sapiente ut aperiam animi deleniti possimus est fuga voluptatem, odio illo quidem vitae sequi neque consequatur at debitis nulla velit reiciendis harum. Provident ratione id, obcaecati tempore alias inventore, nulla eius deleniti tenetur nemo qui vitae sit dolorum voluptatem, ut recusandae aut distinctio quo eaque deserunt et magnam soluta esse? Optio, officiis tempora similique quam reiciendis laborum, dignissimos sapiente repudiandae deleniti totam ipsa. Question is Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur non itaque facilis, quo officia, laboriosam rem nesciunt cumque illo obcaecati ratione </span> 
            </span>
            <div className='p-1 w-full'>
                <span className='font-semibold'>Tags:</span>
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="javascrpit" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <Tag tagName="java" />
                <div> <span className='font-semibold'> Asked By: </span> Ahsan</div>
            </div>
        </div>

    </div>
  )
}

export default QuestionTag
