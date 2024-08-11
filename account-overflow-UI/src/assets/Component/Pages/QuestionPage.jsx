import React, { useMemo } from "react";
import QuestionTag from "../QuestionBlock/QuestionTag.jsx";
import Header from "../PageHeaders/Header.jsx";
import Button_1 from "../Buttons/Button_1";
import { useEffect, useState } from "react";
import axios from "../Axios/axios.js";

const QuestionPage = () => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [pagenationState, setPagenationState] = useState([]);
  const [changePage, setChangePage] = useState(1);
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    window.scrollTo(top);
  }, []);

  const updatePage = () => {

    let pageNumber = document.getElementById("customPage").value;
    if(pageNumber < 1 || pageNumber > pagenationState.last_page || pageNumber == pagenationState.current_page) return;
    setChangePage(pageNumber);
    document.getElementById("customPage").value = "";

  };

  const newPages = async () => {
    if (changePage == pagenationState.current_page) return;

    const response = await axios
      .get(`/allquestion/?page=${changePage}`)
      .then((response) => {
        setAllQuestions(response.data.results);
        setPagenationState(response.data);
      })
      .catch((error) => console.log(error));

    setDisableButton(false);
  };

  useMemo(newPages, [changePage]);

  return (
    <div className="max-[980px]:w-full max-[600px]:left-0 max-[600px]:z-10 flex w-[84.%] h-max relative left-52 overflow-x-hidden overflow-y-scroll top-[3.95rem] max-[600px]:top-[5.3rem]">
      <div className="h-max w-[58%] max-[980px]:w-full  scrollbar-track-orange-600">
        <Header heading="All Questions" route="/ask" btnText="Ask Question" />

        {allQuestions.map((question) => (
          <QuestionTag
            key={question.id}
            ques={question.question_text}
            tags={question.tags}
            name={question.name}
            answers_count={question.answers_count}
          />
        ))}

        {/* Pagenation */}
        <div className="flex flex-col border-t-2 border-t-gray-300 justify-center items-center gap-3 p-5">
          <div className="flex flex-wrap justify-around p-2 w-[100%]">
            <Button_1
              runFunction={() => {
                if (disableButton == true || changePage <= 1) return;

                setDisableButton(true);
                setChangePage(changePage - 1);
                // console.log("changeButton State: ", changePage);
              }}
              buttonName="Previous Page"
            />
            <Button_1
              runFunction={() => {
                if (
                  disableButton == true ||
                  changePage >= pagenationState.last_page
                )
                  return;

                setDisableButton(true);
                setChangePage(changePage + 1);
                // console.log("changeButton State: ", changePage);
              }}
              buttonName="Next Page"
            />
          </div>

          <div className="flex flex-col justify-center w-100%">
            <div className="text-red-400">
              {" "}
              Total Pages Count:{" "}
              <span className="text-red-900 font-extrabold ml-1">
                {pagenationState.last_page}
              </span>
            </div>

            <div className="w-full  mt-1 ">
              <input
                id="customPage"
                className="border-2 border-gray-300 w-[30vw] h-[5vh] px-5 py-3 rounded max-[600px]:w-[50vw]"
                type="text"
                placeholder="Enter a Custom Page . . ."
              />
              <button onClick={updatePage} className="border-0 bg-blue-500 text-white p-1 px-3 rounded-sm ml-2">Go</button>
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
