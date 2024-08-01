import { create } from 'zustand';

export const useHamburgerStore = create ((set) =>({

    visibility: false,
    changeHamburgerVisibility: (changeState) => {
        set( () => 
            ({ 
                visibility: changeState 
            }) 
        )
    }

}));

// export default useHamburgerStore;