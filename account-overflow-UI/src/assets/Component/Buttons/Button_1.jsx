import React from 'react'

function Button_1(props) {
  return (
    <div>
        <button onClick={props.runFunction} className='border-0 bg-blue-500 text-white py-1 px-3 rounded-sm mt-1'>{props.buttonName}</button>
    </div>
  )
}

export default Button_1
