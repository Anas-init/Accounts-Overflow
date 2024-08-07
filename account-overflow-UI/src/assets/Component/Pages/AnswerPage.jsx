import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Section_1 from "../User Input Sections/Section_1";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUserCredentials } from "../ZustandStore/user-credentials-store";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { FaArrowAltCircleDown } from "react-icons/fa";

const AnswerPage = () => {
  const objectFormat = yup.object().shape({
    answer: yup
      .string()
      .required("This is a required field")
      .matches(
        /[A-Z a-z 0-9]{15,}/,
        "Minimum Length criteria must be followed"
      ),
    csvFile: yup
      .mixed()
      .test("is-valid-file", "Only CSV Files are acceptable", (value) => {
        return value[0]?.name.split(".")[1] === "csv" || value.length === 0;
      })
      .notRequired(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(objectFormat),
  });

  const [question, setQuestion] = useState(useLocation().state);
  const { authTokens } = useUserCredentials();

  const submitAnswer = (data) => {
    console.log(data);
  };

  const PostedAnswerSection = () => {
    return (
      <div className="flex gap-2 p-3 border-2 border-gray-400 border-dashed rounded">
        <div className="flex flex-col items-center justify-center gap-5">
          <FaArrowAltCircleUp className="h-10 w-10 hover:cursor-pointer" />
          <div> 2347 </div>
          <FaArrowAltCircleDown className="h-10 w-10 hover:cursor-pointer" />
        </div>

        <div className="flex flex-col gap-2 p-3">
          <div>
            {" "}
            <span className="font-bold"> Username: </span> ahsan_27617{" "}
          </div>
          <div>
            {" "}
            <span className="font-bold"> Posted Answer: </span> Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Porro mollitia, nam
            eligendi omnis quaerat earum ducimus reprehenderit vero? Alias,
            assumenda? Lorem ipsum dolor sit amecipit deserunt omnis sit nulla
            perferendis necessitatibus in. Ipsum?{" "}
          </div>
          <div>
            {" "}
            <span className="font-bold"> CSV File: </span> No File{" "}
          </div>
          <div>
            {" "}
            <span className="font-bold"> Posted On: </span>{" "}
            {new Date().toLocaleDateString()}{" "}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-[980px]:w-full max-[600px]:left-0 max-[600px]:z-10 flex flex-col gap-2 w-[84.5%] h-max relative left-52 overflow-x-hidden top-[3.95rem] max-[600px]:top-[5.3rem] p-3 pt-10">
      <div className="flex flex-col gap-2">
        <div>
          <span className="text-2xl font-bold mr-2">Question:</span>
          <span className="text-lg">{question}</span>
        </div>

        <div>
          <span className="text-2xl font-bold mr-2">CSV File:</span>
          <span className="text-lg">No File</span>
        </div>
      </div>

      <form
        className="flex flex-col my-5 gap-5"
        onSubmit={handleSubmit(submitAnswer)}
      >
        <Section_1
          header="Write the details of your answer for this question."
          description="Write a precise description of your answer. Minimum 15 English
            characters."
          register={register}
          fieldName="answer"
          error={errors.answer}
          DynamicTag={{
            Tag: "textarea",
            classes: "userInputBox border-2 border-gray-300 px-2 py-1 rounded",
            selfClosingTag: false,
            rows: 6,
            type: "",
          }}
        />

        <Section_1
          header="Add a CSV File (Optional)"
          description="Add a CSV File if your answer requires some CSV specific details."
          register={register}
          fieldName="csvFile"
          error={errors.csvFile}
          DynamicTag={{
            Tag: "input",
            classes: "",
            selfClosingTag: true,
            rows: 0,
            type: "file",
          }}
        />

        {authTokens == null ? (
          <NavLink
            to={"/signIn"}
            className="bg-blue-500 border-2 border-blue-500 text-white text-center px-5 py-1 rounded"
          >
            Post My Answer
          </NavLink>
        ) : (
          <button
            type="submit"
            className="bg-blue-500 border-2 border-blue-500 text-white text-center px-5 py-1 rounded"
            onClick={submitAnswer}
            disabled={isSubmitting}
          >
            Post My Answer
          </button>
        )}
      </form>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">Answers Posted By Other Users: </h1>
        <div className="h-[40rem] flex flex-col gap-4 border-2 border-gray-400 rounded p-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <PostedAnswerSection />
          <PostedAnswerSection />
          <PostedAnswerSection />
          <PostedAnswerSection />
          <PostedAnswerSection />
          <PostedAnswerSection />
        </div>
      </div>
    </div>
  );
};

export default AnswerPage;
