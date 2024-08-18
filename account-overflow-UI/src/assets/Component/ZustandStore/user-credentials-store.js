import { create } from "zustand";
import axios from "../Axios/axios";

export const useUserCredentials = create((set, get) => ({
  authTokens:
    window.localStorage.getItem("token") != null
      ? JSON.parse(window.localStorage.getItem("token"))
      : null,

  setAuthTokens: (updatedAuthTokens) => {
    set(() => ({ authTokens: updatedAuthTokens }));
  },

  logOutUser: () => {
    window.localStorage.removeItem("token");
    set(() => ({ authTokens: null }));
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
