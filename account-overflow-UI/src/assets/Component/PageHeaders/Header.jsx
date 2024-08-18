import React from "react";
import { NavLink } from "react-router-dom";
import { useUserCredentials } from "../ZustandStore/user-credentials-store";

const Header = (props) => {
  const { authTokens } = useUserCredentials();

  return (
    <div className="w-full pt-6 flex flex-col justify-between">
      <div className="w-full flex justify-between mb-10">
        <h1 className="h-max text-3xl p-3 mt-2 font-semibold">
          {props.heading}
        </h1>
        <NavLink
          to={authTokens != null ? props.route : "/signIn"}
          className="h-max p-3 bg-blue-500 text-white text-center rounded-md mt-3 mr-4 transition-all hover:scale-105"
        >
          {props.btnText}
        </NavLink>
      </div>
      {props.description && (
        <div className="p-4 text-xl">
          <span className="font-bold">Description: </span>
          {props.description}
        </div>
      )}
    </div>
  );
};

export default Header;
