import React, { useMemo, useState } from "react";
import Button_1 from "../../../Buttons/Button_1";
import { useMyQuestionsAndAnswersStore } from "../../../ZustandStore/my-questions-and-answers";
import { useUserCredentials } from "../../../ZustandStore/user-credentials-store";
import axios from "../../../Axios/axios";

const MyAnswer = React.memo(({ optionID, currentOpenedContainer }) => {
  const { myAnswers, setMyQuestionsAndAnswers } = useMyQuestionsAndAnswersStore(
    (state) => ({
      myAnswers: state.myAnswers,
      setMyQuestionsAndAnswers: state.setMyQuestionsAndAnswers,
    })
  );
  const authTokens = useUserCredentials((state) => ({
    authTokens: state.authTokens,
  }));
  const [currentAnswer, setCurrentAnswer] = useState("No Answers Posted");
  const [currentAnswerCSV, setCurrentAnswerCSV] = useState(null);
  const [newAnswerCSV, setNewAnswerCSV] = useState(null);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useMemo(() => {
    if (myAnswers == null) {
      setMyQuestionsAndAnswers(
        authTokens?.authTokens?.access,
        "Answer",
        setCurrentAnswer,
        setCurrentAnswerCSV
      );
    } else {
      setCurrentAnswer(myAnswers.length == 0 ? "No Answers Posted" : myAnswers[currentAnswerIndex]?.answer_text);
      setCurrentAnswerCSV(myAnswers.length == 0 ? "No Answers Posted" : myAnswers[currentAnswerIndex]?.ans_csv_file);
    }
  }, []);

  const handleDelete = () => {
    axios.delete(`/delete-answer/?id=${myAnswers[currentAnswerIndex].id}`, {
      headers: {
        Authorization: `Bearer ${authTokens?.authTokens?.access}`,
      },
    })
    .then((res) => {
      console.log(res);
      location.reload(true);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const handleUpdate = () => {
    if (currentAnswer.length <= 15) {
      setErrorMessage("Answer text must be greater than 15 characters.");
      return;
    }

    if (newAnswerCSV && newAnswerCSV.type !== "text/csv") {
      setErrorMessage("Only .csv files are allowed.");
      return;
    }

    const data = newAnswerCSV
      ? { answer_text: currentAnswer, ans_csv_file: newAnswerCSV }
      : { answer_text: currentAnswer };

    console.log(data);
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }

    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    axios
      .put(
        `/update-answer/?id=${myAnswers[currentAnswerIndex].id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authTokens?.authTokens?.access}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        location.reload(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setNewAnswerCSV(file);
    } else {
      setNewAnswerCSV(null);
      if (file) {
        setErrorMessage("Only .csv files are allowed.");
      }
    }
  };

  return (
    <div
      id={optionID}
      className={
        currentOpenedContainer == optionID[optionID.length - 1]
          ? "options-content max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out expanded"
          : "options-content max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out"
      }
    >
      {currentAnswer == "No Answers Posted" ? (
        <div className="text-xl font-bold p-5 border-4 border-gray-300 rounded border-dashed text-center">
          {currentAnswer + "!"}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 p-2 m-2 border-4 border-gray-300 rounded border-dashed">
            <input
              type="text"
              placeholder="Enter tag or question to filter"
              className="p-2 outline-0 border-b-2 border-gray-200"
            />

            <div className="">
              <span className="font-bold mr-2">Question: </span>
              <span>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Dolores accusamus quam sequi, porro sunt repellat voluptatibus
                officia quidem aperiam corporis fugit placeat quis a eveniet,
                minima possimus facilis commodi dicta? Ad aperiam expedita atque
                dolor.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Answer: </span>
                <textarea
                  type="text"
                  className="border-2 p-2 w-full rounded outline-none"
                  value={currentAnswer}
                  onChange={(e) => {
                    setCurrentAnswer(e.target.value);
                  }}
                />
                {errorMessage && (
                  <div className="text-red-500">{errorMessage}</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold">CSV File Uploaded </span>
                <div>
                  {currentAnswerCSV == null ? "No CSV File" : currentAnswerCSV.split('/')[currentAnswerCSV.split('/').length - 1]}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  Choose New CSV File Here:{" "}
                </span>
                <input type="file" accept=".csv" onChange={handleFileChange} />
              </div>
            </div>

            <div className="m-1 flex gap-2">
              <button
                className="p-2 rounded bg-blue-500 text-white transition-all hover:scale-105"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button 
                className="p-2 rounded bg-red-500 text-white transition-all hover:scale-105"
                onClick={handleDelete}  
              >
                Delete
              </button>
            </div>
          </div>

          <div className="m-1 flex justify-between px-2 gap-2">
            <Button_1
              runFunction={() => {
                if (currentAnswerIndex > 0) {
                  setCurrentAnswer(
                    myAnswers[currentAnswerIndex - 1].answer_text
                  );
                  setCurrentAnswerCSV(
                    myAnswers[currentAnswerIndex - 1].ans_csv_file
                  );
                  setCurrentAnswerIndex(currentAnswerIndex - 1);
                }
              }}
              buttonName="Previous Question"
            />
            <Button_1
              runFunction={() => {
                if (currentAnswerIndex < myAnswers.length - 1) {
                  setCurrentAnswer(
                    myAnswers[currentAnswerIndex + 1].answer_text
                  );
                  setCurrentAnswerCSV(
                    myAnswers[currentAnswerIndex + 1].ans_csv_file
                  );
                  setCurrentAnswerIndex(currentAnswerIndex + 1);
                }
              }}
              buttonName="Next Question"
            />
          </div>
        </>
      )}
    </div>
  );
});

export default MyAnswer;
