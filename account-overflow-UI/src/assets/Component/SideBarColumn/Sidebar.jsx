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
import { useSideBarStore } from "../ZustandStore/sidebar-store.js";
import { useUserCredentials } from "../ZustandStore/user-credentials-store.js";

const Sidebar = () => {
  const SideBarPageButton = (sideBarPageButtonProps) => {
    return (
      <div className="flex flex-col gap-1 transition-all bg-slate-100 hover:w-16 hover:h-16 w-14 h-14 rounded-full items-center justify-center">
        <NavLink
          to={sideBarPageButtonProps.to}
          className={(e) =>
            e.isActive
              ? "flex items-center gap-2 w-full h-full p-1 rounded-full cursor-pointer bg-slate-300"
              : "flex items-center gap-2 w-full h-full p-1 rounded-full cursor-pointer"
          }
        >
          <sideBarPageButtonProps.iconTag className="w-full h-8" />{" "}
          {/* <span className="mr-12"> {sideBarPageButtonProps.tag} </span> */}
        </NavLink>
      </div>
    );
  };

  const { showSideBar } = useSideBarStore((state) => ({
    showSideBar: state.showSideBar,
  }));
  const sideBarDisplay = showSideBar
    ? " max-[600px]:left-0 z-20"
    : " max-[600px]:-left-52";
  const authTokens = useUserCredentials((state) => ({
    authTokens: state.authTokens,
  }));

  return (
    <div
      // top-[10vh] max-[600px]:top-[5.7rem]
      className={
        "w-24 h-[110vh] pt-20 border-r-2 border-r-gray-300 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent fixed transition-all bg-white" +
        sideBarDisplay
      }
    >
      <div className="flex flex-col items-center gap-2 my-4 h-max">
        <SideBarPageButton tag="Home" to="/" iconTag={IoHomeSharp} />
        <SideBarPageButton
          tag="Questions"
          to="/questions"
          iconTag={MdQuestionAnswer}
        />
        <SideBarPageButton
          tag="Tags"
          to="/tagsPage"
          iconTag={IoPricetagsSharp}
        />
        <div className="hidden flex-col items-center gap-2 max-[600px]:flex">
          <SideBarPageButton tag="Profile" to="/profile" iconTag={CgProfile} />
          <SideBarPageButton
            tag="Trophies"
            to="/trophies"
            iconTag={GiDiamondTrophy}
          />
          <SideBarPageButton tag="Help" to="/help" iconTag={MdHelpCenter} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
