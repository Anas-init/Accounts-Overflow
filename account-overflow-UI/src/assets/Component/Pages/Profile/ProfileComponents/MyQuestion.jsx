import React, { useMemo, useState } from "react";
import Button_1 from "../../../Buttons/Button_1";
import { useMyQuestionsAndAnswersStore } from "../../../ZustandStore/my-questions-and-answers";
import { useUserCredentials } from "../../../ZustandStore/user-credentials-store";
import axios from "../../../Axios/axios";

const MyQuestion = React.memo(({ optionID, currentOpenedContainer }) => {
  const { myQuestions, setMyQuestionsAndAnswers } =
    useMyQuestionsAndAnswersStore((state) => ({
      myQuestions: state.myQuestions,
      setMyQuestionsAndAnswers: state.setMyQuestionsAndAnswers,
    }));
  const authTokens = useUserCredentials((state) => ({
    authTokens: state.authTokens,
  }));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("No Questions Posted");
  const [currentQuestionCSV, setCurrentQuestionCSV] = useState(null);
  const [newQuestionCSV, setNewQuestionCSV] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");


  useMemo(() => {
    if (myQuestions == null) {
      setMyQuestionsAndAnswers(
        authTokens?.authTokens?.access,
        "Question",
        setCurrentQuestion,
        setCurrentQuestionCSV
      );
    } else {
      setCurrentQuestion(myQuestions.length == 0 ? "No Questions Asked" : myQuestions[currentQuestionIndex]?.question_text);
      setCurrentQuestionCSV(myQuestions.length == 0 ? "No Questions Asked" : myQuestions[currentQuestionIndex]?.que_csv_file);
    }
  }, []);

  const handleDelete = () => {
    axios.delete(`/delete-question/?id=${myQuestions[currentQuestionIndex].id}`, {
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
    if (currentQuestion.length <= 15) {
      setErrorMessage("Question text must be greater than 15 characters.");
      return;
    }

    if (newQuestionCSV && newQuestionCSV.type !== "text/csv") {
      setErrorMessage("Only .csv files are allowed.");
      return;
    }

    const data = newQuestionCSV
      ? { question_text: currentQuestion, que_csv_file: newQuestionCSV }
      : { question_text: currentQuestion };

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
        `/update-question/?id=${myQuestions[currentQuestionIndex].id}`,
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setNewQuestionCSV(file);
    } else {
      setNewQuestionCSV(null);
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
      {currentQuestion == "No Questions Posted" ? (
        <div className="text-xl font-bold p-5 border-4 border-gray-300 rounded border-dashed text-center">
          {currentQuestion + "!"}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 p-2 m-2 border-4 border-gray-300 rounded border-dashed">
            <input
              type="text"
              placeholder="Enter tag or question to filter"
              className="p-2 outline-0 border-b-2 border-gray-200"
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Question: </span>
                <textarea
                  className="border-2 p-2 w-full rounded outline-none"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                />
              </div>
              {errorMessage && (
                <div className="text-red-500">{errorMessage}</div>
              )}

              <div className="flex items-center gap-2">
                <span className="font-semibold">CSV File Uploaded: </span>
                <div>
                  {currentQuestionCSV == null
                    ? "No CSV File"
                    : currentQuestionCSV.split("/")[
                        currentQuestionCSV.split("/").length - 1
                      ]}
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
                if (currentQuestionIndex > 0) {
                  setCurrentQuestion(
                    myQuestions[currentQuestionIndex - 1].question_text
                  );
                  setCurrentQuestionCSV(
                    myQuestions[currentQuestionIndex - 1].que_csv_file
                  );
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                }
              }}
              buttonName="Previous Question"
            />
            <Button_1
              runFunction={() => {
                if (currentQuestionIndex < myQuestions.length - 1) {
                  setCurrentQuestion(
                    myQuestions[currentQuestionIndex + 1].question_text
                  );
                  setCurrentQuestionCSV(
                    myQuestions[currentQuestionIndex + 1].que_csv_file
                  );
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
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

export default MyQuestion;
