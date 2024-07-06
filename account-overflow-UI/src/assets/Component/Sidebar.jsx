import React from 'react'
import { IoHomeSharp } from "react-icons/io5";
import { MdQuestionAnswer } from "react-icons/md";
import { IoPricetagsSharp } from "react-icons/io5";

const Sidebar = (sideBarProps) => {

    const Section = (sectionProps) => {
        return (
            <div className='flex flex-col gap-1 items-end justify-center h-40'>

                <div className='flex items-center gap-2 w-40 p-1 rounded cursor-pointer hover:bg-gray-100'> <sectionProps.iconTag1 /> <span className='mr-12'> {sectionProps.tag1} </span> </div>
                <div className='flex items-center gap-2 w-40 p-1 rounded cursor-pointer hover:bg-gray-100'> <sectionProps.iconTag2 /> <span className='mr-12'> {sectionProps.tag2} </span> </div>
                <div className='flex items-center gap-2 w-40 p-1 rounded cursor-pointer hover:bg-gray-100'> <sectionProps.iconTag3 /> <span className='mr-12'> {sectionProps.tag3} </span>  </div>

            </div>
        )
    }

    const sideBarDisplay = (sideBarProps.toggleSideBarDisplay) ? " max-[600px]:left-0 z-20" : " max-[600px]:-left-52";
    return (
        <div className={'w-52 h-[110vh] border-r-2 border-r-gray-300 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent fixed transition-all top-[10vh] max-[600px]:top-[15.7rem] bg-white' + sideBarDisplay}>
            <Section tag1="Home" iconTag1={IoHomeSharp} tag2="Questions" iconTag2={MdQuestionAnswer} tag3="Tags" iconTag3={IoPricetagsSharp} />
            <Section tag1="Home" iconTag1={IoHomeSharp} tag2="Questions" iconTag2={MdQuestionAnswer} tag3="Tags" iconTag3={IoPricetagsSharp} />
            <Section tag1="Home" iconTag1={IoHomeSharp} tag2="Questions" iconTag2={MdQuestionAnswer} tag3="Tags" iconTag3={IoPricetagsSharp} />
            <Section tag1="Home" iconTag1={IoHomeSharp} tag2="Questions" iconTag2={MdQuestionAnswer} tag3="Tags" iconTag3={IoPricetagsSharp} />
            <Section tag1="Home" iconTag1={IoHomeSharp} tag2="Questions" iconTag2={MdQuestionAnswer} tag3="Tags" iconTag3={IoPricetagsSharp} />
            <Section tag1="Home" iconTag1={IoHomeSharp} tag2="Questions" iconTag2={MdQuestionAnswer} tag3="Tags" iconTag3={IoPricetagsSharp} />
            <Section tag1="Home" iconTag1={IoHomeSharp} tag2="Questions" iconTag2={MdQuestionAnswer} tag3="Tags" iconTag3={IoPricetagsSharp} />
            <Section tag1="Home" iconTag1={IoHomeSharp} tag2="Questions" iconTag2={MdQuestionAnswer} tag3="Tags" iconTag3={IoPricetagsSharp} />
            <Section tag1="Home" iconTag1={IoHomeSharp} tag2="Questions" iconTag2={MdQuestionAnswer} tag3="Tags" iconTag3={IoPricetagsSharp} />
            <Section tag1="Home" iconTag1={IoHomeSharp} tag2="Questions" iconTag2={MdQuestionAnswer} tag3="Tags" iconTag3={IoPricetagsSharp} />
            <Section tag1="Home" iconTag1={IoHomeSharp} tag2="Questions" iconTag2={MdQuestionAnswer} tag3="Tags" iconTag3={IoPricetagsSharp} />
            <Section tag1="Home" iconTag1={IoHomeSharp} tag2="Questions" iconTag2={MdQuestionAnswer} tag3="Tags" iconTag3={IoPricetagsSharp} />
            <Section tag1="Home" iconTag1={IoHomeSharp} tag2="Questions" iconTag2={MdQuestionAnswer} tag3="Tags" iconTag3={IoPricetagsSharp} />
            <Section tag1="Home" iconTag1={IoHomeSharp} tag2="Questions" iconTag2={MdQuestionAnswer} tag3="Tags" iconTag3={IoPricetagsSharp} />
        </div>
    )
}

export default Sidebar
