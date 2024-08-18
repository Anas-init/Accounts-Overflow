import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { json, NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserCredentials } from "../ZustandStore/user-credentials-store";
import axios from "../Axios/axios";

const InputSection = ({
  field,
  type,
  Icon,
  register,
  name,
  validation,
  error,
}) => {
  return (
    <div className="w-full flex flex-col">
      <div className="flex py-3 px-5 mt-3 w-full items-center justify-between gap-2 bg-white rounded-full">
        <input
          className="text-lg w-[90%] outline-none placeholder:text-black"
          type={type}
          placeholder={field}
          {...register(name, validation)}
        />
        <Icon />
      </div>
      {error && (
        <span className="text-red-600 h-1 w-full mt-2 mb-4 ml-3">
          {error.message}
        </span>
      )}
    </div>
  );
};

const SignIn = () => {

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {setAuthTokens} = useUserCredentials(state => ({setAuthTokens: state.setAuthTokens}));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const fieldValidatorObjects = [
    {
      required: {
        value: true,
        message: "Email is a required Field",
      },
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email address",
      },
    },
    {
      required: {
        value: true,
        message: "Password is a required Field",
      },
      minLength: {
        value: 8,
        message: "Password Length must be greater than 7",
      },
    },
  ];

  const verifyAndLogin = (data) => {

    axios
      .post("/login/", data)
      .then((response) => {
        console.log(response);
        setAuthTokens(response.data.token);
        setError('');
        window.localStorage.setItem("token", JSON.stringify(response.data.token));
        navigate("/");
      })
      .catch((error) => {
        setError(error?.response?.data?.message);
      });

  };

  return (
    <div className="flex flex-col items-center justify-center h-max relative left-24 w-[85%] max-[600px]:left-0 max-[600px]:w-full z-0 top-[3.95rem] pt-10 max-[600px]:px-3">
      <form
        className="flex flex-col items-center justify-center w-[30rem] max-[600px]:w-full gap-4 bg-gray-200 px-7 py-12 m-3 rounded-lg"
        onSubmit={handleSubmit(verifyAndLogin)}
      >
        <h1 className="text-3xl font-bold">Sign In</h1>
        { error != '' && <p className="text-red-600 text-center h-1 w-full mt-2 mb-4 ml-3" >{error}</p> }

        <InputSection
          field="Email"
          type="email"
          Icon={FaUserAlt}
          name="email"
          register={register}
          validation={fieldValidatorObjects[0]}
          error={errors.email}
        />
        <InputSection
          field="Password"
          type="password"
          Icon={FaLock}
          name="password"
          register={register}
          validation={fieldValidatorObjects[1]}
          error={errors.password}
        />

        <div className="flex flex-wrap justify-between w-full">
          <div>
            <input className="cursor-pointer" type="checkbox" />{" "}
            <span>Remember Me</span>
          </div>

          <div className="cursor-pointer hover:underline">Forgot Password</div>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-black outline-none text-white py-3 px-5 text-lg font-bold"
          disabled={isSubmitting}
        >
          Sign In
        </button>

        <div>
          Don't have an account?{" "}
          <NavLink
            to={"/signUp"}
            className="font-bold cursor-pointer hover:underline"
          >
            Sign Up
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
