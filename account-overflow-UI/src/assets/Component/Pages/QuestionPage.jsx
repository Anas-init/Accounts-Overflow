import React from "react";
import QuestionTag from "../QuestionBlock/QuestionTag.jsx";
import Header from "../PageHeaders/Header.jsx";
import Button_1 from "../Buttons/Button_1";
import { useEffect } from "react";

const QuestionPage = () => {
  useEffect(() => {
    window.scrollTo(top);
  }, []);

  return (
    <div className="max-[980px]:w-full max-[600px]:left-0 max-[600px]:z-10 flex w-[84.%] h-max relative left-52 overflow-x-hidden overflow-y-scroll top-[3.95rem] max-[600px]:top-[5.3rem]">
      <div className="h-max w-[58%] max-[980px]:w-full  scrollbar-track-orange-600">
        <Header heading="All Questions" route="/ask" btnText="Ask Question" />
        <QuestionTag />
        <QuestionTag />
        <QuestionTag />
        <QuestionTag />
        <QuestionTag />
        <QuestionTag />
        <QuestionTag />

        {/* Pagenation */}
        <div className="flex flex-col border-t-2 border-t-gray-300 justify-center items-center gap-3 p-5">
          <div className="flex flex-wrap justify-around p-2 w-[100%]">
            <Button_1 buttonName="Previous Page" />
            <Button_1 buttonName="Next Page" />
          </div>

          <div className="flex flex-col justify-center w-100%">
            <div className="text-red-400">
              {" "}
              There are total{" "}
              <span className="text-red-900 font-extrabold">23535</span> number
              of Pages{" "}
            </div>
            <input
              className="border-2 border-gray-300 w-[30vw] h-[5vh] px-5 py-3 rounded mt-1 max-[600px]:w-[50vw]"
              type="text"
              placeholder="Enter a Custom Page . . ."
            />
          </div>

          {/* <div className='flex justify-center gap-5 w-[100%]'>

                        <div className='p-2'>Questions per page: </div>

                        <div id='perPageQuestionChanger' className='flex gap-2' onClick={changePerPageQuestions}>
                            <button id='15_pages' className='p-2 bg-white border-2 border-gray-300 rounded-md'>15</button>
                            <button id='30_pages' className='p-2 bg-white border-2 border-gray-300 rounded-md'>30</button>
                            <button id='45_pages' className='p-2 bg-white border-2 border-gray-300 rounded-md'>45</button>
                        </div>

                    </div> */}
        </div>
      </div>

      <div className="border-2 border-cyan-800 max-[980px]:hidden">
        Useless Box
      </div>
    </div>
  );
};

export default QuestionPage;
