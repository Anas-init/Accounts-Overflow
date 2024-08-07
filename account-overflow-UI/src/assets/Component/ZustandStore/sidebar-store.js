import { create } from 'zustand';

export const useSideBarStore = create((set) => ({

    showSideBar: true,
    toggleSideBarStatus: () => set((state) => ({showSideBar: !state.showSideBar})),
    changeSideBarStatus: (changeState) => set({showSideBar: changeState}),

})); 

