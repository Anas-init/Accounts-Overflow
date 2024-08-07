import { create } from 'zustand';
import axios from '../Axios/axios';

export const useUserCredentials = create((set) => ({
  authTokens: window.localStorage.getItem("token") ? JSON.parse(window.localStorage.getItem("token")) : null,
  userData: null,
  setAuthTokens: (updatedAuthTokens) => {
    set({ authTokens: updatedAuthTokens });
  },
  setUserData: (updatedUserData) => {
    set({ userData: updatedUserData });
  },
  logOutUser: () => {
    window.localStorage.removeItem("token");
    set({authTokens: null})
  },
  updateToken: () => {
    axios.get("/refresh/", {
      headers: {
        "token": authTokens.refresh,
        "Content-Type": "application/json"
      }
    }).then(response => console.log(response) )
  }
}));
