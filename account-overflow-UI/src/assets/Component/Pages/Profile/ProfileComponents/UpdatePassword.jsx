import React, { useState } from "react";
import Button_1 from "../../../Buttons/Button_1";
import Input_Field from "./Input_Field";
import axios from "../../../Axios/axios";
import { useUserCredentials } from "../../../ZustandStore/user-credentials-store";

const UpdatePassword = React.memo(({ optionID, currentOpenedContainer }) => {
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { authTokens } = useUserCredentials(state => ({
    authTokens: state.authTokens
  }));

  const handleUpdate = () => {
    if (newPass.length <= 7) {
      setErrorMessage("New password must be greater than 7 characters.");
      return;
    }

    if (newPass !== confirmNewPass) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    const passwordUpdateData = {
      // currentPassword: currPass,
      password: `"` + newPass + `"`,
      password2: `"` + confirmNewPass + `"`,
    };

    console.log("Password update object:", passwordUpdateData);
    // console.log(authTokens.access);

    // Add your API call or other logic here
    axios.post('/change/', passwordUpdateData, {
      headers: {
        Authorization: `Bearer ${authTokens?.access}`
      }
    })
    .then((res) => {
      console.log(res);
      location.reload(true);
    })
    .catch((err) => {
      console.log(err);
    })

    // Clear error message after successful validation
    setErrorMessage("");
  };

  return (
    <div
      id={optionID}
      className={
        currentOpenedContainer === optionID[optionID.length - 1]
          ? "options-content max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out expanded"
          : "options-content max-h-0 overflow-hidden transition-[max-height] duration-500 ease-in-out"
      }
    >
      <div className="flex flex-col gap-2 p-2 m-2 border-4 border-gray-300 rounded border-dashed">
        <Input_Field
          placeholder="Enter Current Password"
          value={currPass}
          onChange={setCurrPass}
        />
        <Input_Field
          placeholder="Enter New Password"
          value={newPass}
          onChange={setNewPass}
        />
        <Input_Field
          placeholder="Re-Enter New Password"
          value={confirmNewPass}
          onChange={setConfirmNewPass}
        />
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        <Button_1 runFunction={handleUpdate} buttonName="Update" />
      </div>
    </div>
  );
});

export default UpdatePassword;
