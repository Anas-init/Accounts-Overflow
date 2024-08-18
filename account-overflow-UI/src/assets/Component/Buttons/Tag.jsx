import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Tag = ({ tagName, tagDescription }) => {
  const tagBtnRef = useRef(null);

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const tagBtn = tagBtnRef.current;
    if (tagBtn) {
      tagBtn.addEventListener("click", handleScrollToTop);
    }

    return () => {
      if (tagBtn) {
        tagBtn.removeEventListener("click", handleScrollToTop);
      }
    };
  }, []);

  const navigate = useNavigate();

  return (
    <button
      ref={tagBtnRef}
      id="tagBtn"
      onClick={() => navigate(`/tags/${tagName}`, {state: {
        tagName: tagName,
        tagDescription: tagDescription,
      }})}
      className="bg-gray-200 w-max hover:bg-gray-300 m-1 px-2 rounded font-semibold"
    >
      {tagName}
    </button>
  );
};

export default Tag;
