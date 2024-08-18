import React, { useState } from "react";
import Header from "../PageHeaders/Header.jsx";
import QuestionTag from "../QuestionBlock/QuestionTag.jsx";
import { useEffect, useMemo } from "react";
import axios from "../Axios/axios.js";
import { useAllQuestionStore } from "../ZustandStore/all-questions-store.js";

const Home = () => {
  useEffect(() => {
    window.scrollTo(top);
  }, []);

  const { allQuestions, setAllQuestions } = useAllQuestionStore(state => ({allQuestions: state.allQuestions, setAllQuestions: state.setAllQuestions}));

  useMemo(() => {
    if (allQuestions === null) setAllQuestions();
  }, [allQuestions]);

  return (
    <div className="max-[980px]:w-full max-[600px]:left-0 max-[600px]:z-10 flex w-[94%] h-max relative left-24 overflow-x-hidden overflow-y-scroll top-[3.95rem] max-[600px]:top-[5.3rem]">
      <div className="h-max w-[58%] max-[980px]:w-full border-b-2 border-b-gray-300">
        <Header heading="Top Questions" route="/ask" btnText="Ask Question" />

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
              .sort((a, b) => b.answers_count - a.answers_count)
              .filter((item, index) => index < 10)
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

      <div className="border-2 border-cyan-800 max-[980px]:hidden">
        Useless Box
      </div>
    </div>
  );
};

export default Home;
