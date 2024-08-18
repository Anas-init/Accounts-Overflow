import React, { useMemo } from "react";
import QuestionTag from "../QuestionBlock/QuestionTag.jsx";
import Header from "../PageHeaders/Header.jsx";
import Button_1 from "../Buttons/Button_1";
import { useEffect, useState } from "react";
import axios from "../Axios/axios.js";
import { useAllQuestionStore } from "../ZustandStore/all-questions-store.js";

const QuestionPage = () => {
  useEffect(() => {
    window.scrollTo(top);
  }, []);

  const { allQuestions, setAllQuestions, allQuestionPageRenderingArray  } = useAllQuestionStore((state) => ({
    allQuestions: state.allQuestions,
    setAllQuestions: state.setAllQuestions,
    allQuestionPageRenderingArray: state.allQuestionPageRenderingArray,
  }));
  const [currentPage, setCurrentPage] = useState(0);

  useMemo(() => {
    if (allQuestionPageRenderingArray == null) setAllQuestions();
  }, [allQuestionPageRenderingArray]);

  // console.log(allQuestionPageRenderingArray);

  return (
    // left-52
    <div className="max-[980px]:w-full max-[600px]:left-0 max-[600px]:z-10 flex w-[94%] h-max relative left-24 overflow-x-hidden overflow-y-scroll top-[3.95rem] max-[600px]:top-[5.3rem]">
      <div className="h-max w-[58%] max-[980px]:w-full  scrollbar-track-orange-600">
        <Header heading="All Questions" route="/ask" btnText="Ask Question" />

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
            {allQuestionPageRenderingArray[currentPage]?.map((question) => {
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

        {/* Pagenation */}
        <div className="flex flex-col border-t-2 border-b-2 border-t-gray-300 justify-center items-center gap-3 p-5 pb-8">
          <div className="flex flex-wrap justify-around p-2 w-[100%]">
            <Button_1
              runFunction={() => {
                if (allQuestionPageRenderingArray == null || currentPage <= 0) return;
                setCurrentPage(currentPage - 1);
              }}
              buttonName="Previous Page"
            />
            <Button_1
              runFunction={() => {
                if (
                  allQuestionPageRenderingArray == null ||
                  currentPage >= allQuestionPageRenderingArray.length - 1
                )
                  return;
                setCurrentPage(currentPage + 1);
              }}
              buttonName="Next Page"
            />
          </div>

          <div className="flex flex-col justify-center w-100%">
            <div className="text-red-400">
              {" "}
              Total Pages Count:
              <span className="text-red-900 font-extrabold ml-1">
                {allQuestionPageRenderingArray == null ? 0 : allQuestionPageRenderingArray.length}
              </span>
            </div>

            <div className="w-full  mt-1 ">
              <input
                id="customPage"
                className="border-2 border-gray-300 w-[30vw] h-[5vh] px-5 py-3 rounded max-[600px]:w-[50vw]"
                type="text"
                placeholder="Enter a Custom Page . . ."
              />
              <button
                className="border-0 bg-blue-500 text-white p-1 px-3 rounded-sm ml-2 transition-all hover:scale-105"
                onClick={(event) => {
                  const customPage = document.getElementById("customPage");
                  if (
                    allQuestionPageRenderingArray == null ||
                    customPage.value > allQuestionPageRenderingArray.length ||
                    customPage < 1 ||
                    currentPage == customPage.value - 1
                  )
                    return;

                  setCurrentPage(customPage.value - 1);
                  customPage.value = "";
                }}
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-cyan-800 max-[980px]:hidden">
        Useless Box
      </div>
    </div>
  );
};

export default QuestionPage;
