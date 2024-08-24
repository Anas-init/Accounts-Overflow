import React from "react";

const Section_1 = ({
  header,
  description,
  register,
  fieldName,
  error,
  DynamicTag,
  initialValue = "",
  setInitialValue
}) => {
  return (
    <div className="section flex flex-col border-2 border-gray-400 gap-2 p-8 rounded">
      <div className="font-bold">{header}</div>
      <div>{description}</div>
      {error && <div className="text-red-600"> {error.message} </div>}
      {
        DynamicTag.selfClosingTag == true ? (
          <DynamicTag.Tag
            className={DynamicTag.classes}
            type={DynamicTag.type}
            {...register(fieldName)}
            onChange={(e) => setInitialValue(e.target.value)}
          />
        ) : (
          <DynamicTag.Tag
            className={DynamicTag.classes}
            rows={DynamicTag.rows}
            {...register(fieldName)}
            value={initialValue}
            onChange={(e) => setInitialValue(e.target.value)}
          ></DynamicTag.Tag>
        )

        // className="userInputBox border-2 border-gray-300 px-2 py-1 rounded"
        // rows={6}
        // {...register("question")}
      }
    </div>
  );
};

export default Section_1;
