import React from "react";
import "./AskQuestionPage.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Section_1 from "../User Input Sections/Section_1";

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

        <Section_1
          header="What are the details of your problem?"
          description="Write a precise description of your problem. Minimum 15 English
            characters."
          register={register}
          fieldName="question"
          error={errors.question}
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
          description="Add a CSV File if your problem requires some CSV specific details."
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

        <Section_1
          header="Tags"
          description="Add upto 3 tags to describe what your question is about. Add Comma (,) Seperated tags."
          register={register}
          fieldName="tags"
          error={errors.tags}
          DynamicTag={{
            Tag: "textarea",
            classes: "userInputBox border-2 border-gray-300 px-2 py-1 rounded",
            selfClosingTag: false,
            rows: 1,
            type: "",
          }}
        />

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
            disabled={isSubmitting}
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

export default AskQuestionPage;
