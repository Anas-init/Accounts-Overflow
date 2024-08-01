// import { useLocation } from 'react-router-dom';
import { useState, useEffect } from "react"
import Navbar from "./assets/Component/NavigationBar/Navbar.jsx"
import { Outlet } from "react-router-dom"
import { useHamburgerStore } from "./assets/Component/ZustandStore/hamburger-store.js"
function App() {

  const { changeHamburgerVisibility } = useHamburgerStore((state) => ({
    changeHamburgerVisibility: state.changeHamburgerVisibility
  }));

  const handleResize = () => {
    if(window.innerWidth <= 600) changeHamburgerVisibility(true);
    else changeHamburgerVisibility(false);
  }

  useEffect(() => {

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize);

  }, [window.innerWidth])

  return (
    <div className="scrollbar-none h-full">
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default App
