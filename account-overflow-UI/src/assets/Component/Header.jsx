import React from 'react'


const Header = (props) => {
  return (
    <div className='w-full flex justify-between pb-20'>
      <h1 className='h-max text-3xl p-3 mt-2 font-semibold'>{props.heading}</h1>
      <button className='h-max p-3 bg-blue-500 text-white rounded-xl mt-3'>{props.btnText}</button>
    </div>
  )
}

export default Header
