import React from "react";
import "./AskQuestionPage.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const AskQuestionPage = () => {
  const resetAll = () => {
    const allUserInputBoxes = document.querySelectorAll(".userInputBox");
    const main_question_container = document.querySelector(
      ".main-question-container"
    );
    const allSections = document.querySelectorAll(".section");

    if (main_question_container.firstChild.classList.contains("error-message"))
      main_question_container.removeChild(main_question_container.firstChild);

    for (let i = 0; i < allSections.length; i++)
      allSections[i].classList.remove("border-red-400");

    for (let i = 0; i < allUserInputBoxes.length; i++)
      allUserInputBoxes[i].value = "";

    window.scrollTo(top);
  };

  const submitQuestion = (data) => {
    console.log(data);
  };

  const objectFormat = yup.object().shape({
    question: yup
      .string()
      .required("This is a required field")
      .matches(/[A-Z a-z 0-9]{15,}/, "Minimum Length criteria must be followed"),
    csvFile: yup
      .mixed()
      .test("is-valid-file", "Only CSV Files are acceptable", (value) => {

        return value[0]?.name.split('.')[1] === "csv" || value.length === 0;
        
      })
      .notRequired(),
      // .matches(/[a-zA-Z0-9]+\.csv/, "Only CSV files are acceptable"),
    tags: yup
      .string()
      .required("This is a required field")
      .matches(
        /^\w{3,}(,\w{3,}){0,2}$/,
        "Each Tag must be of minimum 3 characters"
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(objectFormat),
  });

  return (
    <form
      className="flex flex-col h-max relative left-52 w-[85%] max-[600px]:left-0 max-[600px]:w-full z-0 top-[3.95rem] px-12 py-12"
      onSubmit={handleSubmit(submitQuestion)}
    >
      <h1 className="text-black text-3xl font-bold">Ask a Public Question</h1>

      <div className="main-question-container flex flex-col my-5 gap-5">
        <div className="section flex flex-col border-2 border-gray-400 gap-2 p-8 rounded">
          <div className="font-bold">What are the details of your problem?</div>
          <div>
            Write a precise description of your problem. Minimum 15 English
            characters.
          </div>
          {errors.question && (
            <div className="text-red-600"> {errors.question.message} </div>
          )}
          <textarea
            className="userInputBox border-2 border-gray-300 px-2 py-1 rounded"
            rows={6}
            name=""
            id=""
            {...register("question")}
          />
        </div>

        <div className="section flex flex-col border-2 border-gray-400 gap-2 p-8 rounded">
          <div className="font-bold">Add a CSV File (Optional)</div>
          <div>
            Add a CSV File if your problem requires some CSV specific details.
          </div>
          {errors.csvFile && (
            <div className="text-red-600"> {errors.csvFile.message} </div>
          )}
          <input
            className="userInputBox"
            type="file"
            name=""
            id=""
            {...register("csvFile", { required: false })}
          />
        </div>

        <div className="section flex flex-col border-2 border-gray-400 gap-2 p-8 rounded">
          <div className="font-bold">Tags</div>
          <div>
            Add upto 3 tags to describe what your question is about. Add Comma (
            , ) Seperated tags.
          </div>
          {errors.tags && (
            <div className="text-red-600"> {errors.tags.message} </div>
          )}
          <textarea
            className="userInputBox border-2 border-gray-300 px-2 py-1 rounded"
            rows={1}
            name=""
            id=""
            {...register("tags")}
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 border-2 border-blue-500 text-white px-5 py-1 rounded"
            onClick={submitQuestion}
          >
            Post
          </button>
          <button
            className="bg-transparent border-2 border-red-500 text-red-500 px-5 py-1 rounded"
            onClick={resetAll}
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

export default AskQuestionPage;
