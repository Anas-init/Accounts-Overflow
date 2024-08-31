import { create } from "zustand";
import axios from "../Axios/axios";

export const useMyQuestionsAndAnswersStore = create((set) => ({
  myQuestions: null,
  myAnswers: null,
  setMyQuestionsAndAnswers: (
    access_token,   
    valueType,
    setValue1,
    setValue2
  ) => {
    axios
      .get("/profileinfo/", {
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      })
      .then((res) => {
        // console.log(res.data.data.questions);
        // console.log(res.data.data.answers);
        set(() => ({ myQuestions: res?.data?.data?.questions }));
        set(() => ({ myAnswers: res?.data?.data?.answers }));

        if(valueType == "Question" && setValue1 != null && setValue2 != null) {
          setValue1(res?.data?.data?.questions.length == 0 ? "No Questions Posted" : res?.data?.data?.questions[0].question_text)
          setValue2(res?.data?.data?.questions.length == 0 ? "No Questions Posted" : res?.data?.data?.questions[0].que_csv_file)
        } 
        if(valueType == "Answer" && setValue1 != null && setValue2 != null) {
          setValue1(res?.data?.data?.answers.length == 0 ? "No Answers Posted" : res?.data?.data?.answers[0].answer_text)
          setValue2(res?.data?.data?.answers.length == 0 ? "No Answers Posted" : res?.data?.data?.answers[0].ans_csv_file)
        }

      })
      .catch((err) => {
        console.log(err);
        set(() => ({ myQuestions: null }));
        set(() => ({ myAnswers: null }));
      });
  },
  resetMyQuestionsAndAnswers: () => {
    set(() => ({myQuestions: null}));
    set(() => ({myAnswers: null}));
  }
}));
