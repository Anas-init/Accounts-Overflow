import React from "react";
import { FaGreaterThan } from "react-icons/fa";

const OptionContainer = React.memo(
  ({
    iconID,
    optionID,
    optionType,
    OptionDescription,
    currentOpenedContainer,
    updateContainer,
  }) => {
    return (
      <section className="border-t-2 border-gray-300 flex flex-col gap-4 px-3 py-2">
        <div className="flex gap-2 items-center transition-all">
          <FaGreaterThan
            id={iconID}
            className={
              currentOpenedContainer == optionID[optionID.length - 1]
                ? "cursor-pointer transition-all rotate-90"
                : "cursor-pointer transition-all"
            }
            onClick={(event) => {
              updateContainer(optionID);
            }}
          />
          <span className="text-xl font-semibold">{optionType}</span>
        </div>

        <OptionDescription
          optionID={optionID}
          currentOpenedContainer={currentOpenedContainer}
        />
      </section>
    );
  }
);

export default OptionContainer;
