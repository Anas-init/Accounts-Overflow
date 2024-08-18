import { create } from "zustand";
import axios from "../Axios/axios";

export const useAllAnswersStore = create((set) => ({
  allAnswers: null,
  setAllAnswers: (questionID) => {
    axios
      .get(`/allanswer/?id=${questionID}`)
      .then((response) => { set(() => ({ allAnswers: response.data.data.answers })) })
      .catch((err) => set(() => ({ allAnswers: null })));
  },
  clearAllAnswers: () => {
    set(() => ({ allAnswers: null }));
  }
}));
