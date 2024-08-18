import React from "react";
import { CgProfile } from "react-icons/cg";
import { GiDiamondTrophy } from "react-icons/gi";
import { MdHelpCenter } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useSideBarStore } from "../ZustandStore/sidebar-store";
import { useHamburgerStore } from "../ZustandStore/hamburger-store";
import { useUserCredentials } from "../ZustandStore/user-credentials-store";
import { useAllQuestionStore } from "../ZustandStore/all-questions-store";

const Icon = (iconProps) => {
  return (
    <div className="px-2 h-full cursor-pointer rounded-md hover:bg-gray-200">
      <iconProps.iconName className="h-[100%] w-6  " />
    </div>
  );
};

const Navbar = () => {
  const { toggleSideBarStatus } = useSideBarStore((state) => ({
    toggleSideBarStatus: state.toggleSideBarStatus,
  }));
  const { visibility } = useHamburgerStore((state) => ({
    visibility: state.visibility,
  }));
  const { authTokens, logOutUser } = useUserCredentials((state) => ({
    authTokens: state.authTokens,
    logOutUser: state.logOutUser,
  }));
  const { allQuestions, setAllQuestionPageRenderingArray } = useAllQuestionStore((state) => ({
    allQuestions: state.allQuestions,
    setAllQuestionPageRenderingArray: state.setAllQuestionPageRenderingArray,
  }));
  const navigate = useNavigate();

  return (
    <div className="w-[100%] h-16 max-[600px]:gap-2 flex items-center justify-between border-b-2 border-b-gray-300 border-t-4 border-t-yellow-300 fixed z-30 bg-white max-[750px]:overflow-x-scroll pl-3 pr-4">
      {/* Hamburger */}
      {/* gap-1 cursor-pointer hidden flex-col max-[600px]:flex */}
      <div
        className={
          visibility
            ? "gap-1 cursor-pointer flex flex-col"
            : "gap-1 cursor-pointer hidden"
        }
        onClick={() => toggleSideBarStatus()}
      >
        <div className="border-2 border-black w-6 rounded"></div>
        <div className="border-2 border-black w-6 rounded"></div>
        <div className="border-2 border-black w-6 rounded"></div>
      </div>

      {/* Logo */}
      <img
        className="h-14 w-64 object-cover ml-3 max-[600px]:hidden"
        src="./src/assets/account-overflow-logo-final.jpg"
        alt="account overflow"
      />
      <img
        className="h-14 w-64 aspect-video object-cover hidden max-[600px]:block"
        src="./src/assets/account-overflow-logo-without-header.jpg"
        alt="account overflow"
      />

      {/* Search */}
      <input
        className="border-2 border-gray-400 w-[50vw] h-10 px-5 py-3 rounded max-[600px]:w-[100vw] max-[600px]:mr-4"
        placeholder="Search..."
        type="text"
        name="search"
        id="searchBar"
        onChange={(e) => {

          navigate("/questions");
          const temp = allQuestions.flat().filter((item) =>
            item.question_text
              .replace(/[" ]/g, "")
              .toLowerCase()
              .match(new RegExp(`${e.target.value.toLowerCase().replace(/[ ]/g, '')}`, "g"))
          );

          const newArray = Array(Math.ceil(temp.length / 10)).fill([]);
          let ctr = 0;
          for(let i = 0; i < newArray.length; i++) {
            let j = 0;
            while(j < 10 && ctr < temp.length) {
              newArray[i] = [...newArray[i], temp[ctr++]];
              j++;
            }
          }

          setAllQuestionPageRenderingArray(newArray);

        }}
      />

      {/* Icons */}
      <div className="flex gap-1 justify-around h-full items-center max-[600px]:hidden">
        <Icon iconName={CgProfile} />
        <Icon iconName={GiDiamondTrophy} />
        <Icon iconName={MdHelpCenter} />
      </div>

      {authTokens == null ? (
        <NavLink
          to={"/signIn"}
          className={(e) =>
            e.isActive
              ? "hidden"
              : "bg-blue-500 text-white text-center w-28 py-1 px-3 rounded-full max-[750px]:w-24 transition-all hover:scale-105"
          }
        >
          Sign In
        </NavLink>
      ) : (
        <button
          onClick={() => {
            navigate("/");
            logOutUser();
          }}
          className="bg-blue-500 text-white text-center w-28 py-1 px-3 rounded-full max-[750px]:w-24 transition-all hover:scale-105"
        >
          Log Out
        </button>
      )}
    </div>
  );
};

export default Navbar;
