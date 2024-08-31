import React, {useState} from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Input_Field = React.memo(({ placeholder, value, onChange }) => {
  const [passShowHide, setPassShowHide] = useState(false);
  return (
    <div className="flex p-2 rounded border-2 my-2 w-60 justify-between items-center">
      <input
        className="outline-none w-full"
        type={passShowHide ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {passShowHide ? (
        <FaEyeSlash
          className="cursor-pointer"
          onClick={() => setPassShowHide(!passShowHide)}
        />
      ) : (
        <FaEye
          className="cursor-pointer"
          onClick={() => setPassShowHide(!passShowHide)}
        />
      )}
    </div>
  );
});

export default Input_Field;
