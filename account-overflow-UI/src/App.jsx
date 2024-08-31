// import { useLocation } from 'react-router-dom';
import { useMemo, useEffect, useState } from "react";
import Navbar from "./assets/Component/NavigationBar/Navbar.jsx";
import Sidebar from "./assets/Component/SideBarColumn/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import { useHamburgerStore } from "./assets/Component/ZustandStore/hamburger-store.js";
import { useUserCredentials } from "./assets/Component/ZustandStore/user-credentials-store.js";

function App() {
  const { changeHamburgerVisibility } = useHamburgerStore((state) => ({
    changeHamburgerVisibility: state.changeHamburgerVisibility,
  }));
  const { authTokens, updateToken } = useUserCredentials((state) => ({
    authTokens: state.authTokens,
    updateToken: state.updateToken,
  }));

  useEffect(() => {
    let timeoutID = setTimeout(() => {
      if (authTokens != null) updateToken();
      // console.log(authTokens);
    }, 50);

    return () => clearInterval(timeoutID);
  }, []);

  useEffect(() => {
    let timeoutID = setInterval(() => {
      if (authTokens != null) updateToken();
      // console.log(authTokens);
    }, 1000 * 60);

    return () => clearInterval(timeoutID);
  }, []);

  const handleResize = () => {
    if (window.innerWidth <= 600) changeHamburgerVisibility(true);
    else changeHamburgerVisibility(false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);

  useEffect(() => {
    window.scrollTo(top);
  }, []);

  return (
    <div className="h-full">
      <Navbar />
      <Outlet />
      {/* <Sidebar /> */}
      {/* <Profile /> */}
    </div>
  );
}

export default App;
