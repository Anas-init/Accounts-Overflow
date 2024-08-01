import React from 'react'

const Tag = ({ tagName }) => {
  return (
    <>
      <button className='bg-gray-200 w-max hover:bg-gray-300 m-1 px-2 rounded font-semibold'>{tagName}</button>
    </>
  )
}

export default Tag
