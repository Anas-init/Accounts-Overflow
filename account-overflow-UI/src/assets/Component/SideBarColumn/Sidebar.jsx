import React from "react";
import { IoHomeSharp } from "react-icons/io5";
import { MdQuestionAnswer } from "react-icons/md";
import { IoPricetagsSharp } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { GiDiamondTrophy } from "react-icons/gi";
import { MdHelpCenter } from "react-icons/md";
import { RiLoginCircleFill } from "react-icons/ri";
import Registration from "../Registration/Register";
import {useSideBarStore} from '../ZustandStore/sidebar-store.js'

const Sidebar = () => {
  

  const SideBarPageButton = (sideBarPageButtonProps) => {
    return (
      <div className="flex flex-col gap-1 items-end justify-center h-max">
        <NavLink
          to={sideBarPageButtonProps.to}
          className={(e) =>
            e.isActive
              ? "flex items-center gap-2 w-40 p-1 rounded cursor-pointer bg-gray-200 "
              : "flex items-center gap-2 w-40 p-1 rounded cursor-pointer hover:bg-gray-50"
          }
        >
          <sideBarPageButtonProps.iconTag />{" "}
          <span className="mr-12"> {sideBarPageButtonProps.tag} </span>
        </NavLink>
      </div>
    );
  };

  const {showSideBar} = useSideBarStore((state) => ({ showSideBar: state.showSideBar }))
  const sideBarDisplay = showSideBar ? " max-[600px]:left-0 z-20" : " max-[600px]:-left-52";

  return (
    <div
      className={
        "w-52 h-[110vh] border-r-2 border-r-gray-300 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent fixed transition-all top-[10vh] max-[600px]:top-[5.7rem] bg-white" +
        sideBarDisplay
      }
    >

      <div className="flex flex-col my-4 h-max">

        <SideBarPageButton tag="Home" to="/" iconTag={IoHomeSharp} />
        <SideBarPageButton tag="Questions" to="/questions" iconTag={MdQuestionAnswer} />
        <SideBarPageButton tag="Tags" to="/tagsPage" iconTag={IoPricetagsSharp} />
        <div className="hidden max-[600px]:block">
            <SideBarPageButton tag="Profile" to="/profile" iconTag={CgProfile} />
            <SideBarPageButton tag="Trophies" to="/trophies" iconTag={GiDiamondTrophy} />
            <SideBarPageButton tag="Help" to="/help" iconTag={MdHelpCenter} />
            <SideBarPageButton tag="Sign In" to="/signIn" iconTag={RiLoginCircleFill} />
        </div>

      </div>

    </div>
  );
};

export default Sidebar;
