import React, { useState } from 'react';
import { FaStackOverflow} from 'react-icons/fa';
import {Link} from 'react-router-dom'
import { CgProfile } from "react-icons/cg";
import { GiTrophyCup } from "react-icons/gi";
import { FcAbout } from "react-icons/fc";
const Navbar = () => {
  return (
    <div className='Navbar-class'>
      <div className='logo-class'>
      <FaStackOverflow size={30} color='fb8500'></FaStackOverflow>
      </div>
      <span>Accounts Overflow.</span>
      <input type="text" placeholder='Search'/>
      <div className='icon-class'>
        <a href='#'><CgProfile size={20}/></a>
        <a href='#'><GiTrophyCup size={20}/></a>
        <a href='#'><FcAbout size={20}/></a>
      </div>
    </div>
  );
};

export default Navbar;
