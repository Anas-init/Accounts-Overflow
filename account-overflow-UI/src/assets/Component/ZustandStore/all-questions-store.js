import { create } from "zustand";
import axios from "../Axios/axios";

export const useAllQuestionStore = create((set) => ({
  allQuestions: null,
  allQuestionPageRenderingArray: null,
  setAllQuestionPageRenderingArray: (updatedArray) => {
    set(() => ({ allQuestionPageRenderingArray: updatedArray }));
  },
  setAllQuestions: () => {
    axios
      .get("/allquestion/")
      .then((res) => {
        console.log(res);
        set(() => ({ allQuestions: res?.data?.results }));
        set(() => ({ allQuestionPageRenderingArray: res?.data?.results }));
      })
      .catch((err) => {
        set(() => ({ allQuestions: null }));
        set(() => ({ allQuestionPageRenderingArray: null }));
      });
  },
}));
