import React from "react";
// import { CgProfile } from "react-icons/cg";
import { FaGreaterThan } from "react-icons/fa";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import "../../../index.css";
import QuestionTag from "../QuestionBlock/QuestionTag.jsx";
import Button_1 from "../Buttons/Button_1";
// import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Profile = () => {
  const MyQuestions = ({ optionID }) => {
    return (
      <div
        id={optionID}
        className="options-content max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out"
      >
        <div className="flex flex-col gap-2 p-2 m-2 border-4 border-gray-300 rounded border-dashed">
          <input
            type="text"
            placeholder="Enter tag or question to filter"
            className="p-2 outline-0"
          />
          <QuestionTag
            ques="ajdnvjv jwe vjh re"
            ques_id="2"
            tags="tag1"
            name="abc"
            answers_count={2}
          />

          <div className="m-1 flex gap-2">
            <NavLink
              className="p-2 rounded bg-blue-500 text-white transition-all hover:scale-105"
              to={"/ask"}
              state={{
                initialQuestionText:
                  "Question jsnj cn vj j vjwes ewhjb hjw ejrhb erhj bjhe jrhw bwkj kjer bkjw ",
                initialFile: "No File",
                initialTags: "tag1,tag2",
              }}
            >
              Edit
            </NavLink>
            <button className="p-2 rounded bg-red-500 text-white transition-all hover:scale-105">
              Delete
            </button>
          </div>
        </div>

        <div className="m-1 flex justify-between px-2 gap-2">
          <Button_1 runFunction={() => {}} buttonName="Previous Question" />
          <Button_1 runFunction={() => {}} buttonName="Next Question" />
        </div>
      </div>
    );
  };

  const MyAnswers = ({ optionID }) => {
    return (
      <div
        id={optionID}
        className="options-content max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out"
      >
        <div className="flex flex-col gap-2 p-2 m-2 border-4 border-gray-300 rounded border-dashed">
          <input
            type="text"
            placeholder="Enter tag or question to filter"
            className="p-2 outline-0"
          />
          <QuestionTag
            ques="ajdnvjv jwe vjh re"
            ques_id="2"
            tags="tag1"
            name="abc"
            answers_count={2}
          />

          <div className="">
            <span className="font-bold mr-2">My Answer: </span>
            <span>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores
              accusamus quam sequi, porro sunt repellat voluptatibus officia
              quidem aperiam corporis fugit placeat quis a eveniet, minima
              possimus facilis commodi dicta? Ad aperiam expedita atque dolor.
            </span>
          </div>

          <div className="m-1 flex gap-2">
            <NavLink
              className="p-2 rounded bg-blue-500 text-white transition-all hover:scale-105"
              to={"/answer"}
              state={{
                initialAnswerText:
                  "Question jsnj cn vj j vjwes ewhjb hjw ejrhb erhj bjhe jrhw bwkj kjer bkjw ",
                initialFile: "No File",
              }}
            >
              Edit
            </NavLink>
            <button className="p-2 rounded bg-red-500 text-white transition-all hover:scale-105">
              Delete
            </button>
          </div>
        </div>

        <div className="m-1 flex justify-between px-2 gap-2">
          <Button_1 runFunction={() => {}} buttonName="Previous Question" />
          <Button_1 runFunction={() => {}} buttonName="Next Question" />
        </div>
      </div>
    );
  };

  const UpdateUserName = ({ optionID }) => {
    return (
      <div
        id={optionID}
        className="options-content max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out"
      >        
        <div className="flex flex-col gap-2 p-2 m-2 border-4 border-gray-300 rounded border-dashed">

          <input className="p-2 rounded border-2 my-2" type="text" placeholder="Enter Current Username" />
          <input className="p-2 rounded border-2 my-2" type="text" placeholder="Enter Updated Username" />
          <Button_1 runFunction={() => {}} buttonName="Update" />

        </div>

      </div>
    );
  };

  const UpdateEmail = ({ optionID }) => {
    return (
      <div
        id={optionID}
        className="options-content max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out"
      >        
        <div className="flex flex-col gap-2 p-2 m-2 border-4 border-gray-300 rounded border-dashed">

          <input className="p-2 rounded border-2 my-2" type="text" placeholder="Enter Current Email" />
          <input className="p-2 rounded border-2 my-2" type="text" placeholder="Enter Updated Email" />
          <Button_1 runFunction={() => {}} buttonName="Update" />

        </div>

      </div>
    );
  };

  const UpdatePassword = ({ optionID }) => {
    return (
      <div
        id={optionID}
        className="options-content max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out"
      >        
        <div className="flex flex-col gap-2 p-2 m-2 border-4 border-gray-300 rounded border-dashed">

          <input className="p-2 rounded border-2 my-2" type="text" placeholder="Enter Current Password" />
          <input className="p-2 rounded border-2 my-2" type="text" placeholder="Enter New Password" />
          <input className="p-2 rounded border-2 my-2" type="text" placeholder="Re-Enter New Password" />
          <Button_1 runFunction={() => {}} buttonName="Update" />

        </div>

      </div>
    );
  };

  const MyContributions = ({ optionID }) => {
    return (
      <div
        id={optionID}
        className="options-content max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out"
      >        
        <div className="flex flex-col gap-2 p-2 m-2 border-4 border-gray-300 rounded border-dashed">

          <div>
            <span className="font-semibold">Total Questions Asked: </span>
            <span>3487</span>
          </div>

          <div>
            <span className="font-semibold">Total Answers Posted: </span>
            <span>3745</span>
          </div>

        </div>

      </div>
    );
  };

  const OptionContainer = ({
    iconID,
    optionID,
    optionType,
    OptionDescription,
  }) => {
    return (
      <section className="border-t-2 border-gray-300 flex flex-col gap-4 px-3 py-2">
        <div className="flex gap-2 items-center transition-all">
          <FaGreaterThan
            id={iconID}
            className="cursor-pointer transition-all"
            onClick={(event) => {
              let options = document.getElementById(`${optionID}`);
              if (options.classList.contains("expanded")) {
                options.classList.remove("expanded");
              } else {
                options.classList.add("expanded");
              }

              document
                .getElementById(`${iconID}`)
                .classList.toggle("rotate-90");
            }}
          />
          <span className="text-xl font-semibold">{optionType}</span>
        </div>

        <OptionDescription optionID={optionID} />
      </section>
    );
  };

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
        <button className="text-blue-500 hover:underline cursor-pointer" onClick={(event) => {
          event.target.previousElementSibling.click();
        }}>Choose a Profile Photo</button>
      </section>

      <OptionContainer
        iconID={"bullet-icon-1"}
        optionID={"option-1"}
        optionType={"My Questions"}
        OptionDescription={MyQuestions}
      />
      <OptionContainer
        iconID={"bullet-icon-2"}
        optionID={"option-2"}
        optionType={"My Answers"}
        OptionDescription={MyAnswers}
      />
      <OptionContainer
        iconID={"bullet-icon-3"}
        optionID={"option-3"}
        optionType={"Update Username"}
        OptionDescription={UpdateUserName}
      />
      <OptionContainer
        iconID={"bullet-icon-4"}
        optionID={"option-4"}
        optionType={"Update Email"}
        OptionDescription={UpdateEmail}
      />
      <OptionContainer
        iconID={"bullet-icon-5"}
        optionID={"option-5"}
        optionType={"Update Password"}
        OptionDescription={UpdatePassword}
      />
      <OptionContainer
        iconID={"bullet-icon-6"}
        optionID={"option-6"}
        optionType={"My Contributions"}
        OptionDescription={MyContributions}
      />
    </div>
  );
};

export default Profile;
