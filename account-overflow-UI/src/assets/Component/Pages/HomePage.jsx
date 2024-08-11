import React, { useState } from "react";
import Header from "../PageHeaders/Header.jsx";
import QuestionTag from "../QuestionBlock/QuestionTag.jsx";
import { useEffect } from "react";
import axios from "../Axios/axios.js";

const Home = () => {
  const [topQuestions, setTopQuestions] = useState([]);

  useEffect(() => {
    window.scrollTo(top);
  }, []);

  useEffect(() => {
    const response = axios
      .get("/allquestion/")
      .then((response) => {
        setTopQuestions(response.data.results);
        console.log(response.data.results);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="max-[980px]:w-full max-[600px]:left-0 max-[600px]:z-10 flex w-[84.%] h-max relative left-52 overflow-x-hidden overflow-y-scroll top-[3.95rem] max-[600px]:top-[5.3rem]">
      <div className="h-max w-[58%] max-[980px]:w-full  scrollbar-track-orange-600">
        <Header heading="Top Questions" route="/ask" btnText="Ask Question" />

        {topQuestions.map((question) => (
          <QuestionTag
            key={question.id}
            ques={question.question_text}
            tags={question.tags}
            name={question.name}
            answers_count={question.answers_count}
          />
        ))}

      </div>

      <div className="border-2 border-cyan-800 max-[980px]:hidden">
        Useless Box
      </div>
    </div>
  );
};

export default Home;
