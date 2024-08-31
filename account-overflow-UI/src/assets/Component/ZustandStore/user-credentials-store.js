import { create } from "zustand";
import axios from "../Axios/axios";
import { useMyQuestionsAndAnswersStore } from "./my-questions-and-answers";

export const useUserCredentials = create((set, get) => ({
  authTokens:
    window.localStorage.getItem("token") != null
      ? JSON.parse(window.localStorage.getItem("token"))
      : null,

  setAuthTokens: (updatedAuthTokens) => {
    set(() => ({ authTokens: updatedAuthTokens }));
  },

  logOutUser: () => {
    // const { resetMyQuestionsAndAnswers } = useMyQuestionsAndAnswersStore(
    //   (state) => ({
    //     resetMyQuestionsAndAnswers: state.resetMyQuestionsAndAnswers,
    //   })
    // );

    window.localStorage.removeItem("token");
    set(() => ({ authTokens: null }));
    // resetMyQuestionsAndAnswers();
  },

  updateToken: () => {
    // console.log(get().authTokens);

    if (get().authTokens == null) return;

    // console.log(get().authTokens.refresh);
    axios
      .get(`/refresh/?token=${get().authTokens.refresh}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const newAuthObject = {
          access: response.data.access_token,
          refresh: get().authTokens.refresh,
        };

        window.localStorage.setItem("token", JSON.stringify(newAuthObject));
        set(() => ({ authTokens: { ...newAuthObject } }));

        // console.log("Updated authTokens state:", get().authTokens);
      })
      .catch((err) => {
        console.log("Catched");
        console.log(err);
        set(() => ({ authTokens: null }));
      });
  },
}));
