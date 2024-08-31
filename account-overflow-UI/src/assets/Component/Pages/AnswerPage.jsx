import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Section_1 from "../User Input Sections/Section_1";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUserCredentials } from "../ZustandStore/user-credentials-store";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "../Axios/axios";

const AnswerPage = () => {
  const objectFormat = yup.object().shape({
    answer_text: yup
      .string()
      .required("This is a required field")
      .matches(
        /[A-Z a-z 0-9]{15,}/,
        "Minimum Length criteria must be followed"
      ),
    ans_csv_file: yup
      .mixed()
      .test("is-valid-file", "Only CSV Files are acceptable", (value) => {
        return (
          !value ||
          value?.length === 0 ||
          value[0]?.name?.split(".")[1] === "csv"
        );
      })
      .notRequired(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(objectFormat),
  });

  const [question, setQuestion] = useState(useLocation().state.question_text);
  const [questionID, setQuestionID] = useState(useLocation().state.question_id);
  const { authTokens } = useUserCredentials((state) => ({
    authTokens: state.authTokens,
  }));
  const [questionCSVFile, setQuestionCSVFile] = useState(
    useLocation().state.que_csv_file
  );
  const [allAnswers, setAllAnswers] = useState(null);
  const [votingStates, setVotingStates] = useState(null);

  const [initalAnswerText, setInitalAnswerText] = useState(useLocation().state == null ? "" : useLocation().state.initialAnswerText);
  const [initalFile, setInitalFile] = useState(useLocation().state == null ? "" : useLocation().state.initialFile);

  useEffect(() => {
    console.log("Component mounted!");
    return () => {
      console.log("Component Unmounted!");
    };
  }, []);

  useMemo(() => {
    if (allAnswers === null) {

      axios
        .get(`/allanswer/?id=${questionID}`)
        .then((response) => {
          // setCSV(URL.createObjectURL(response.data.ans_csv_file.blob()))
          setAllAnswers(response.data.data.answers);
          setVotingStates(
            response.data.data.answers === null
              ? []
              : Array(response.data.data.answers.length)
                  .fill(0)
                  .map((item, index) => response.data.data.answers[index].votes)
          );
          // console.log(votingStates);
        })
        .catch((err) => setAllAnswers(null));
    }

    // console.log(votingStates);
    // console.log(allAnswers);
  }, [allAnswers]);

  const submitAnswer = (data) => {
    data["question"] = questionID;
    data["votes"] = 0;
    data["total_views"] = 0;
    data["user"] = jwtDecode(authTokens.access)["user_id"];

    console.log(data);

    const formData = new FormData();

    if (data["ans_csv_file"]?.length == 0) delete data["ans_csv_file"];

    for (const key in data) {
      if (key === "ans_csv_file" && data[key].length > 0) {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }

    axios
      .post("/answer/", formData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`, // Let Axios handle the Content-Type
        },
      })
      .then((res) => {
        console.log(res);
        setInitalAnswerText("");
        setInitalFile(null);
        location.reload(true);
      })
      .catch((err) => {
        if (err.response) {
          console.log("Response error data:", err.response.data);
          console.log("Response status:", err.response.status);
          console.log("Response headers:", err.response.headers);
        } else if (err.request) {
          console.log("Request error:", err.request);
        } else {
          console.log("Error:", err.message);
        }
      });
  };

  const downloadAnswerCSV = (ans_id) => {
    // console.log(e);
    axios
      .get(`/allanswer/`, {
        params: {
          answer_id: ans_id,
          download_csv: true,
        },
        responseType: "blob", // Important for handling binary data
      })
      .then((res) => {
        console.log(res);
        console.log(res.headers["content-disposition"]);

        const contentDisposition = res.headers["content-disposition"];
        let filename = "download.csv"; 
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (filenameMatch.length > 1) {
            filename = filenameMatch[1];
          }
        }

        // Create a blob from the response data
        const blob = new Blob([res.data], { type: "csv" });

        // Create a download link and trigger the download
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const PostedAnswerSection = ({
    votes = 0,
    ans_csv_file = "",
    answer_id = null,
    answer_text = "",
    username = "",
    upVotingFunction,
    downVotingFunction,
  }) => {
    // console.log(answer_id);
    return (
      <div className="flex gap-2 p-3 border-2 border-gray-400 border-dashed rounded">
        <div className="flex flex-col items-center justify-center gap-5">
          <FaArrowAltCircleUp
            onClick={upVotingFunction}
            className="h-10 w-10 hover:cursor-pointer"
          />
          <div> {votes} </div>
          <FaArrowAltCircleDown
            onClick={downVotingFunction}
            className="h-10 w-10 hover:cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-2 p-3">
          <div>
            {" "}
            <span className="font-bold"> Username: </span> {username}{" "}
          </div>
          <div>
            {" "}
            <span className="font-bold"> Posted Answer: </span> {answer_text}
          </div>
          <div>
            {" "}
            <span className="font-bold"> CSV File: </span>{" "}
            <a
              className="hover:underline cursor-pointer"
              onClick={() => downloadAnswerCSV(answer_id)}
            >
              {ans_csv_file.split('/').at(-1)}
            </a>
          </div>
          <div>
            {" "}
            <span className="font-bold"> Posted On: </span>{" "}
            {new Date().toLocaleDateString()}{" "}
          </div>
        </div>
      </div>
    );
  };

  const downloadQuestionFile = (e) => {
    axios
      .get(`/allquestion/`, {
        params: {
          question_id: questionID,
          download_csv: true,
        },
        responseType: "blob", // Important for handling binary data
      })
      .then((res) => {
        console.log(res);
        console.log(res.headers["content-disposition"]);

        const contentDisposition = res.headers["content-disposition"];
        let filename = "download.csv"; // Default filename if none is found
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (filenameMatch.length > 1) {
            filename = filenameMatch[1];
          }
        }

        // Create a blob from the response data
        const blob = new Blob([res.data], { type: "csv" });

        // Create a download link and trigger the download
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="max-[980px]:w-full max-[600px]:left-0 max-[600px]:z-10 flex flex-col gap-2 w-[93%] h-max relative left-24 overflow-x-hidden top-[3.95rem] max-[600px]:top-[5.3rem] p-3 pt-10">
      <div className="flex flex-col gap-2">
        <div>
          <span className="text-2xl font-bold mr-2">Question:</span>
          <span className="text-lg">{question}</span>
        </div>

        <div>
          <span className="text-2xl font-bold mr-2">CSV File:</span>
          <span
            className="text-lg hover:underline cursor-pointer"
            onClick={downloadQuestionFile}
          >
            {questionCSVFile?.split("/").at(-1)}
          </span>
        </div>
      </div>

      <form
        className="flex flex-col my-5 gap-5"
        onSubmit={handleSubmit(submitAnswer)}
      >
        <Section_1
          header="Write the details of your answer for this question."
          description="Write a precise description of your answer. Minimum 15 English
            characters."
          register={register}
          fieldName="answer_text"
          error={errors.answer_text}
          DynamicTag={{
            Tag: "textarea",
            classes: "userInputBox border-2 border-gray-300 px-2 py-1 rounded",
            selfClosingTag: false,
            rows: 6,
            type: "",
          }}
          initialValue={initalAnswerText}
          setInitialValue={setInitalAnswerText}
        />

        <Section_1
          header="Add a CSV File (Optional)"
          description="Add a CSV File if your answer requires some CSV specific details."
          register={register}
          fieldName="ans_csv_file"
          error={errors.ans_csv_file}
          DynamicTag={{
            Tag: "input",
            classes: "",
            selfClosingTag: true,
            rows: 0,
            type: "file",
          }}
          initialValue={initalFile}
          setInitialValue={setInitalFile}
        />

        {authTokens == null ? (
          <NavLink
            to={"/signIn"}
            className="bg-blue-500 border-2 border-blue-500 text-white text-center px-5 py-1 rounded transition-all hover:scale-[1.01]"
          >
            Post My Answer
          </NavLink>
        ) : (
          <button
            type="submit"
            className="bg-blue-500 border-2 border-blue-500 text-white text-center px-5 py-1 rounded transition-all hover:scale-[1.01]"
            onClick={submitAnswer}
            disabled={isSubmitting}
          >
            Post My Answer
          </button>
        )}
      </form>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">Answers Posted By Other Users: </h1>
        <div className="h-[40rem] flex flex-col gap-4 border-2 border-gray-400 rounded p-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {allAnswers != null &&
            votingStates != null &&
            allAnswers?.map((ans, index) => {
              // console.log(ans);
              return (
                <PostedAnswerSection
                  key={index}
                  votes={votingStates[index]}
                  ans_csv_file={
                    ans.ans_csv_file == null ? "No CSV File" : ans.ans_csv_file
                  }
                  answer_id={ans.id}
                  answer_text={ans.answer_text}
                  username={ans.user.name}
                  upVotingFunction={() => {
                    if (votingStates[index] < ans.votes + 1)
                      setVotingStates(
                        Array(votingStates.length)
                          .fill(0)
                          .map((item, i) => {
                            console.log("upvoting clicked");
                            if (index == i) return votingStates[i] + 1;
                            return votingStates[i];
                          })
                      );
                  }}
                  downVotingFunction={() => {
                    if (votingStates[index] > ans.votes - 1)
                      setVotingStates(
                        Array(votingStates.length)
                          .fill(0)
                          .map((item, i) => {
                            console.log("downvoting clicked");
                            if (index == i) return votingStates[i] - 1;
                            return votingStates[i];
                          })
                      );
                  }}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AnswerPage;
