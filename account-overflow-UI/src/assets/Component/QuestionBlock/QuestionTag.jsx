import React, { useState } from "react";
import Tag from "../Buttons/Tag";
import { NavLink } from "react-router-dom";

const QuestionTag = ({
  ques = "",
  ques_id = "",
  tags = "",
  name = "",
  answers_count,
  que_csv_file="No CSV File"
}) => {
  const [Question, setQuestion] = useState(ques.replace(/["]/g, ""));
  const [Tags, setTags] = useState(tags.replace(/["]/g, "").split(","));
  const [username, setUsername] = useState(name);
  const [answer_count, setAnswer_count] = useState(answers_count);

  return (
    <div className="w-full flex border-t-2 border-t-gray-300 py-3">
      <div className="w-32 p-2 flex flex-col gap-1 justify-center">
        {/* <span className='font-semibold'>Views: 0</span>
            <span className='font-semibold'>Votes: 0</span> */}
        <span className="font-semibold">Answers: {answer_count}</span>
      </div>

      <div className="w-full flex flex-col">
        <span className="p-1">
          <span className="font-semibold">Question: </span>
          <NavLink
            to={"/answer"}
            state={{
              question_text: Question,
              question_id: ques_id,
              que_csv_file: que_csv_file,
            }}
            className="text-blue-400 hover:underline hover:cursor-pointer"
          >
            {" "}
            {Question}
          </NavLink>
        </span>
        <div className="p-1 w-full">
          <div className="flex flex-wrap">
            <span className="font-semibold">Tags:</span>

            {Tags.map((tag, index) => {
              return <Tag key={index} tagName={tag} />;
            })}
          </div>
          <div>
            {" "}
            <span className="font-semibold"> Asked By: </span> {username}{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionTag;
