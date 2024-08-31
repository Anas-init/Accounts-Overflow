import React from 'react'
import { useMyQuestionsAndAnswersStore } from '../../../ZustandStore/my-questions-and-answers';

const MyContributions = ({ 
    optionID,
    currentOpenedContainer 
}) => {

    const {myQuestions, myAnswers} = useMyQuestionsAndAnswersStore(state => ({
      myQuestions: state.myQuestions,
      myAnswers: state.myAnswers,
    }))
    return (
      <div
        id={optionID}
        className={
          currentOpenedContainer == optionID[optionID.length - 1]
            ? "options-content max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out expanded"
            : "options-content max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out"
        }
      >
        <div className="flex flex-col gap-2 p-2 m-2 border-4 border-gray-300 rounded border-dashed">
          <div>
            <span className="font-semibold">Total Questions Asked: </span>
            <span>{myQuestions?.length}</span>
          </div>

          <div>
            <span className="font-semibold">Total Answers Posted: </span>
            <span>{myAnswers?.length}</span>
          </div>
        </div>
      </div>
    );
  };

export default MyContributions
