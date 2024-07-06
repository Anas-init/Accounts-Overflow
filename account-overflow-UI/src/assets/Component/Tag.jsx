import React from 'react'

const Tag = ({tagName}) => {
  return (
    <button className='bg-gray-200 hover:bg-gray-300 m-1 px-2 rounded'>{tagName}</button>
  )
}

export default Tag
