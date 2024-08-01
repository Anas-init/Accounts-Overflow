import React from 'react'
import { CgProfile } from "react-icons/cg";
import { GiDiamondTrophy } from "react-icons/gi";
import { MdHelpCenter } from "react-icons/md";
// import Registration from '../Registration/Register';
import { NavLink } from 'react-router-dom';
import {useSideBarStore} from '../ZustandStore/sidebar-store'
import { useHamburgerStore } from '../ZustandStore/hamburger-store';

const Icon = (iconProps) => {
  return (
    <div className='px-2 h-full cursor-pointer rounded-md hover:bg-gray-200'>
      <iconProps.iconName className="h-[100%] w-6  " />
    </div>
  )
}

const Navbar = () => {

  const {toggleSideBarStatus} = useSideBarStore((state) =>({
    toggleSideBarStatus: state.toggleSideBarStatus
  }));

  const {visibility} = useHamburgerStore((state) => ({
    visibility: state.visibility
  }));

  return (
    <div className='w-[100%] h-[10vh] max-[600px]:gap-2 flex items-center justify-between border-b-2 border-b-gray-300 border-t-4 border-t-yellow-300 fixed z-20 bg-white max-[400px]:overflow-x-scroll pl-3 pr-4' >

      {/* Hamburger */}
      {/* gap-1 cursor-pointer hidden flex-col max-[600px]:flex */}
      <div className={visibility ? 'gap-1 cursor-pointer flex flex-col' : 'gap-1 cursor-pointer hidden'} onClick={() => toggleSideBarStatus()}>
        <div className='border-2 border-black w-6 rounded'></div>
        <div className='border-2 border-black w-6 rounded'></div>
        <div className='border-2 border-black w-6 rounded'></div>
      </div>

      {/* Logo */}
      <img className='h-[8vh] w-64 object-cover ml-3 max-[600px]:hidden' src="./src/assets/account-overflow-logo-final.jpg" alt="No Image" />
      <img className='h-[8vh] w-64 aspect-video object-cover hidden max-[600px]:block' src="./src/assets/account-overflow-logo-without-header.jpg" alt="No Image" />

      {/* Search */}
      <input className='border-2 border-gray-400 w-[50vw] h-[6vh] px-5 py-3 rounded max-[600px]:w-[100vw] max-[600px]:mr-4' placeholder='Search...' type="text" name="search" id="searchBar" />

      {/* Icons */}
      <div className='flex gap-1 justify-around h-full items-center max-[600px]:hidden'>
        <Icon iconName={CgProfile}/>
        <Icon iconName={GiDiamondTrophy} />
        <Icon iconName={MdHelpCenter} />
        {/* <Registration /> */}
      </div>

      <NavLink to={"/signIn"} className={ (e) => (e.isActive) ? 'hidden' : 'bg-blue-500 text-white py-2 px-4 rounded-full max-[600px]:hidden'}>Sign In</NavLink>

    </div>
  )
}

export default Navbar
