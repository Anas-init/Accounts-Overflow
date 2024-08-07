import React, { useRef } from "react";
import { FaLock } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import axios from "../Axios/axios";

const InputSection = (
  { type, placeHolder, Icon, register, name, error }
) => {
  return (
    <div className="w-full flex flex-col">
      <div className="flex py-3 px-5 mt-2 w-full items-center justify-between gap-2 bg-white rounded-full">
        <input
          className="text-lg w-[90%] outline-none placeholder:text-black"
          type={type}
          placeholder={placeHolder}
          {...register(name)}
          // autoComplete="off"
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

const SignUp = () => {

  const schema = yup.object().shape({
    name: yup
      .string()
      .matches(
        /[A-Z a-z]+_[0-9]+/,
        `Valid Pattern for username is "name_numbers"`
      )
      .required("Username is a required field"),
    email: yup
      .string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid Email Address")
      .required("Email is a required field"),
    password: yup
      .string()
      .min(8, "Password Length must be greater than 7")
      .required("Password is a required field"),
    password2: yup
      .string()
      .oneOf([yup.ref("password"), null], "Password must match")
      .required("Confirm Password is a required field"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  
  const verfiyAndRegister = (data) => {

    console.log(data);

    
    axios.post('/register/', data)
    .then((response) => {
      console.log(response); // store access, refresh token;
    })
    .catch((error) => {
      console.log(error);
    });    

    navigate("/");

  };

  return (
    <div className="flex flex-col items-center justify-center h-max relative left-52 w-[85%] max-[600px]:left-0 max-[600px]:w-full z-0 top-[3.95rem] pt-10 max-[600px]:px-3">
      <form
        className="flex flex-col items-center justify-center w-[30rem] max-[600px]:w-full gap-4 bg-gray-200 px-7 py-12 m-3 mb-10 rounded-lg"
        onSubmit={handleSubmit(verfiyAndRegister)}
      >
        <h1 className="text-3xl font-bold">Sign Up</h1>

        <InputSection
          type="text"
          placeHolder="Username"
          Icon={FaUserAlt}
          register={register}
          name="name"
          error={errors.name}
        />
        <InputSection
          type="email"
          placeHolder="Email"
          Icon={MdEmail}
          register={register}
          name="email"
          error={errors.email}
        />
        <InputSection
          type="password"
          placeHolder="Password"
          Icon={FaLock}
          register={register}
          name="password"
          error={errors.password}
        />
        <InputSection
          type="password"
          placeHolder="Confirm Password"
          Icon={FaLock}
          register={register}
          name="password2"
          error={errors.password2}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-black outline-none text-white py-3 px-5 text-lg font-bold mt-2"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default SignUp;
