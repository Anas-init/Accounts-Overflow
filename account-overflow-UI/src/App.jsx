import { useState } from "react"
import Navbar from "./assets/Component/Navbar"
import Sidebar from "./assets/Component/Sidebar"
import Home from "./assets/Component/Home"

function App() {

  const [toggleSideBarDisplay, setToggleSideBarDisplay] = useState(false)

  return (
    <div className="scrollbar-none h-full">
      <Navbar toggleSideBarDisplay={toggleSideBarDisplay} setToggleSideBarDisplay={setToggleSideBarDisplay} />
      <Sidebar toggleSideBarDisplay={toggleSideBarDisplay} setToggleSideBarDisplay={setToggleSideBarDisplay} />
      <Home/>
    </div>
  )
}

export default App
