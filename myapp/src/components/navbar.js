import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu, AiOutlineHome, AiOutlineTag, AiOutlineQuestionCircle } from 'react-icons/ai';
import { FaStackOverflow, FaUser } from 'react-icons/fa';
import {Link} from 'react-router-dom'


const Navbar = () => {
  return (
    <div className='Navbar-class'>
      <div className='logo-class'>
      <FaStackOverflow size={35} color='fb8500'></FaStackOverflow>
      </div>
      <span>Accounts Overflow.</span>
    </div>
  );
};

export default Navbar;
