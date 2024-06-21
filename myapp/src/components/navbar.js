import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

const Navbar = () => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: 'Home' },
    { id: 2, text: 'Company' },
    { id: 3, text: 'Resources' },
    { id: 4, text: 'About' },
    { id: 5, text: 'Contact' },
  ];

  return (
    <div className='bg-black flex justify-between items-center h-16 max-w-[1240px] mx-auto px-4 text-white'>
      {/* Logo */}
      <h1 className='text-xl font-semibold text-[#00df9a]'>Accounts Overflow</h1>

      {/* Desktop Navigation */}
      <ul className='hidden md:flex text-sm'>
        {navItems.map(item => (
          <li
            key={item.id}
            className='px-3 py-2 hover:bg-[#00df9a] hover:text-black rounded-md m-1 cursor-pointer duration-300'
          >
            {item.text}
          </li>
        ))}
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className='block md:hidden'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
            : 'ease-in-out w-[60%] duration-500 fixed top-0 left-[-100%]'
        }
      >
        {/* Mobile Logo */}
        <h1 className='text-xl font-semibold text-[#00df9a] m-4'>Accounts Overflow</h1>

        {/* Mobile Navigation Items */}
        {navItems.map(item => (
          <li
            key={item.id}
            className='px-3 py-2 border-b hover:bg-[#00df9a] hover:text-black rounded-md duration-300 cursor-pointer border-gray-600'
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
