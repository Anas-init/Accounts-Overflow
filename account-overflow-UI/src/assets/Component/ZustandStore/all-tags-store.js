import { create } from "zustand";
import axios from "../Axios/axios";

export const useAllTagsStore = create((set) => ({
  allTags: null,
  setAllTags: () => {
    axios
      .get("/alltags/")
      .then((res) => { 
        console.log(res.data.tags);
        set(() => ({ allTags: res.data.tags })) 
      })
      .catch((err) => set(() => ({ allTags: null })));
  },
}));
