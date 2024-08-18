import React, { useMemo } from "react";
import Tag_Header from "../PageHeaders/Tag_Header.jsx";
import Tag from "../Buttons/Tag.jsx";
import { useEffect, useState } from "react";
import axios from "../Axios/axios.js";
import { useAllTagsStore } from "../ZustandStore/all-tags-store.js";

const TagCard = ({ tagDescription, questionsAskedCount, tagName }) => {

  let tagDescrip = (tagDescription?.length > 40) ? tagDescription.slice(0, 40) : tagDescription;
  // if  {
  //   tagDescrip = tagDescription.slice(0, 60);
  // } else {
  //   tagDescrip = tagDescription;
  // }

  return (
    <div className="max-[1000px]:w-[100%] w-[23.5%] h-max border-2 border-gray-300 p-4 flex flex-col gap-2 rounded-md shadow-xl">
      <Tag tagName={tagName} tagDescription={tagDescription} />
      <div className="m-1">{tagDescrip + " . . ."}</div>
      <div className="m-1">
        Questions Asked:{" "}
        <span className="font-semibold"> {questionsAskedCount} </span>{" "}
      </div>
    </div>
  );
};

const TagsPage = () => {
  const { allTags, setAllTags } = useAllTagsStore((state) => ({
    allTags: state.allTags,
    setAllTags: state.setAllTags,
  }));

  useEffect(() => {
    window.scrollTo(top);
  }, []);

  useMemo(() => {
    if (allTags == null) setAllTags();
  }, [allTags]);

  const [renderSelectives, setRenderSelectives] = useState("");

  return (
    <div className="max-[980px]:w-full max-[600px]:left-0 max-[600px]:z-10 flex flex-col w-[94%] h-max relative left-24 overflow-x-hidden overflow-y-scroll top-[3.95rem] max-[600px]:top-[5.3rem] pt-4">
      <Tag_Header
        filterTags={(e) => {
          setRenderSelectives(e.target.value);
          // console.log(renderSelectives);
        }}
      />

      <div className="max-[1000px]:flex-col w-[100%] flex flex-wrap gap-4 p-3">
        {allTags == null ? (
          <div className="flex w-full mb-20 justify-center items-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          <>
            {allTags
              .filter(
                (tagObject) =>
                  tagObject.tag
                    .toLowerCase()
                    .match(new RegExp(`${renderSelectives.toLowerCase()}`, "g")) != null
              )
              .map((tagObject, index) => {
                return (
                  <TagCard
                    key={index}
                    tagDescription={tagObject.description}
                    questionsAskedCount={tagObject.count}
                    tagName={tagObject.tag}
                  />
                );
              })}
          </>
        )}
      </div>
    </div>
  );
};

export default TagsPage;

{
  /* {renderSelectives === ""
              ? allTags.map((tag, index) => {
                  return (
                    <TagCard
                      key={index}
                      tagDescription={""}
                      questionsAskedCount={0}
                      tagName={tag}
                    />
                  );
                })
              : allTags
                  .filter(
                    (tag) =>
                      tag
                        .toLowerCase()
                        .match(new RegExp(`${renderSelectives}`, "g")) != null
                  )
                  .map((tag, index) => {
                    return (
                      <TagCard
                        key={index}
                        tagDescription={""}
                        questionsAskedCount={0}
                        tagName={tag}
                      />
                    );
                  })} */
}

