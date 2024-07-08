import React from 'react'
import { CgProfile } from "react-icons/cg";
import { GiDiamondTrophy } from "react-icons/gi";
import { MdHelpCenter } from "react-icons/md";
import Registration from './register';

const Navbar = (navBarProps) => {
  return (
    <div className='w-[100%] h-[10vh] max-[600px]:flex-col max-[600px]:h-[30vh] max-[600px]:gap-2 flex items-center justify-around border-b-2 border-b-gray-300 border-t-4 border-t-yellow-300 fixed z-20 bg-white' >

        {/* Logo */}
        <img className='h-[8vh] w-64 object-cover' src="./src/assets/account-overflow-logo-final.jpg" alt="No Image" />
        
        {/* Search */}
        <input className='border-2 border-gray-400 w-[50vw] h-[6vh] px-5 py-3 rounded max-[600px]:w-[100vw]' placeholder='Search...' type="text" name="search" id="searchBar" />
        
        {/* Icons */}
        <div className='flex justify-around h-full items-center'>
            <CgProfile className='h-[100%] w-6 mx-3 cursor-pointer rounded-md hover:bg-gray-200'/>
            <GiDiamondTrophy className='h-[100%] w-6 mx-3 cursor-pointer rounded-md hover:bg-gray-200' />
            <MdHelpCenter className='h-[100%] w-6 mx-3 cursor-pointer rounded-md hover:bg-gray-200' />
            <Registration/>
        </div>
        
        {/* Hamburger */}
        <div className='gap-1 cursor-pointer hidden flex-col mb-2 w-full ml-3 max-[600px]:flex'onClick={ () => navBarProps.setToggleSideBarDisplay(!navBarProps.toggleSideBarDisplay) }>
            <div className='border-2 border-black w-6 rounded'></div>
            <div className='border-2 border-black w-6 rounded'></div>
            <div className='border-2 border-black w-6 rounded'></div>
        </div>

    </div>
  )
}

export default Navbar
