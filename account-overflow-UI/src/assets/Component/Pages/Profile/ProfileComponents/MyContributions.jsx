import React from 'react'

const MyContributions = ({ 
    optionID,
    currentOpenedContainer 
}) => {
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
            <span>3487</span>
          </div>

          <div>
            <span className="font-semibold">Total Answers Posted: </span>
            <span>3745</span>
          </div>
        </div>
      </div>
    );
  };

export default MyContributions
