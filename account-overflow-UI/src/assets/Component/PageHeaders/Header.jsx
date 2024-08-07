import React from 'react'
import {NavLink} from "react-router-dom"
import { useUserCredentials } from '../ZustandStore/user-credentials-store'


const Header = (props) => {

  const {authTokens} = useUserCredentials();

  return (
    <div className='w-full pt-6 flex justify-between pb-20'>
      <h1 className='h-max text-3xl p-3 mt-2 font-semibold'>{props.heading}</h1>
      <NavLink to={ (authTokens != null) ? props.route : "/signIn"} className='h-max p-3 bg-blue-500 text-white text-center rounded-md mt-3 mr-2'>{props.btnText}</NavLink>
    </div>
  )
}

export default Header
