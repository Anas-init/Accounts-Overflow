import React, { useEffect, useMemo, useState } from "react";
import Header from "../PageHeaders/Header";
import QuestionTag from "../QuestionBlock/QuestionTag.jsx";
import { useLocation, useParams } from "react-router-dom";
import { useAllQuestionStore } from "../ZustandStore/all-questions-store.js";

const TagAssociatedQuestionsPage = () => {
  const { allQuestions, setAllQuestions } = useAllQuestionStore((state) => ({
    allQuestions: state.allQuestions,
    setAllQuestions: state.setAllQuestions,
  }));
  const [tagType, setTagType] = useState(useParams().tagName);
  const [tagDescription, setTagDescription] = useState(useLocation().state.tagDescription);

  console.log(useLocation().state);
  console.log(tagDescription);

  useEffect(() => {
    window.scrollTo(top);
  }, []);

  useMemo(() => {
    if (allQuestions === null) setAllQuestions();
  }, [allQuestions]);

  // console.log(allQuestions);

  return (
    // w-85%
    <div className="flex flex-col h-max relative left-24 w-[93%] border-b-2 border-gray-300 max-[600px]:left-0 max-[600px]:w-full z-0 top-[3.95rem] py-10">
      <Header
        heading={`Questions tagged { ${tagType} }`}
        route={"/ask"}
        btnText={"Ask Question"}
        description={tagDescription}
      />

      {allQuestions == null ? (
        <div className="flex w-full mb-20 justify-center items-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <>
          {allQuestions
            .flat()
            .filter(
              (item, index) =>
                item.tags
                  .replace(/[" \n]/g, "")
                  .split(",")
                  .find((el) => el === tagType) != undefined
            )
            .map((question) => {
              return (
                <QuestionTag
                  key={question.id}
                  ques={question.question_text}
                  tags={question.tags}
                  name={question.name}
                  answers_count={question.answers_count}
                  ques_id={question.id}
                  que_csv_file={
                    question.que_csv_file == null
                      ? "No CSV File"
                      : question.que_csv_file
                  }
                />
              );
            })}
        </>
      )}
    </div>
  );
};

export default TagAssociatedQuestionsPage;
