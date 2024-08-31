import React, {
  useMemo,
  useState,
  useCallback,
} from "react";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import "../../../../index.css";
import { useMyQuestionsAndAnswersStore } from "../../ZustandStore/my-questions-and-answers";
import { useUserCredentials } from "../../ZustandStore/user-credentials-store";
import MyAnswer from "./ProfileComponents/MyAnswer";
import MyQuestion from "./ProfileComponents/MyQuestion";
import OptionContainer from "./ProfileComponents/OptionContainer";
import UpdatePassword from "./ProfileComponents/UpdatePassword";
import MyContributions from "./ProfileComponents/MyContributions";

const MyProfile = () => {
  const { myQuestions, myAnswers, setMyQuestionsAndAnswers } =
    useMyQuestionsAndAnswersStore((state) => ({
      myQuestions: state.myQuestions,
      myAnswers: state.myAnswers,
      setMyQuestionsAndAnswers: state.setMyQuestionsAndAnswers,
    }));

  const [currentOpenedContainer, setCurrentOpenedContainer] = useState(0);
  const authTokens = useUserCredentials((state) => ({
    authTokens: state.authTokens,
  }));

  useMemo(() => {
    if (myAnswers == null || myQuestions == null) {
      setMyQuestionsAndAnswers(authTokens?.authTokens?.access, "", null, null);
    }
  }, []);

  const updateContainer = useCallback(
    (optionID) => {
      if (currentOpenedContainer == optionID[optionID.length - 1])
        setCurrentOpenedContainer(0);
      else setCurrentOpenedContainer(optionID[optionID.length - 1]);
    },
    [currentOpenedContainer]
  );

  return (
    <div className="max-[980px]:w-full max-[600px]:left-0 max-[600px]:z-10 flex flex-col w-[94%] h-max relative left-24 overflow-x-hidden overflow-y-scroll top-[3.95rem] max-[600px]:top-[5.3rem]">
      <section className="rounded p-4 flex flex-col gap-5 justify-center items-center">
        <div className="h-40 w-40 rounded-full border-4 border-gray-300 flex justify-center items-center">
          <PermIdentityOutlinedIcon
            sx={{ color: "lightgray", width: 150, height: 150 }}
          />
        </div>
        <div className="font-bold text-lg">Hello Username!</div>
        <input type="file" accept="images/*" className="hidden" />
        <button
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={(event) => {
            event.target.previousElementSibling.click();
          }}
        >
          Choose a MyProfile Photo
        </button>
      </section>

      <OptionContainer
        iconID={"bullet-icon-1"}
        optionID={"option-1"}
        optionType={"My Questions"}
        OptionDescription={MyQuestion}
        currentOpenedContainer={currentOpenedContainer}
        updateContainer={updateContainer}
      />
      <OptionContainer
        iconID={"bullet-icon-2"}
        optionID={"option-2"}
        optionType={"My Answers"}
        OptionDescription={MyAnswer}
        currentOpenedContainer={currentOpenedContainer}
        updateContainer={updateContainer}
      />
      <OptionContainer
        iconID={"bullet-icon-5"}
        optionID={"option-5"}
        optionType={"Update Password"}
        OptionDescription={UpdatePassword}
        currentOpenedContainer={currentOpenedContainer}
        updateContainer={updateContainer}
      />
      <OptionContainer
        iconID={"bullet-icon-6"}
        optionID={"option-6"}
        optionType={"My Contributions"}
        OptionDescription={MyContributions}
        currentOpenedContainer={currentOpenedContainer}
        updateContainer={updateContainer}
      />
    </div>
  );
};

export default MyProfile;
