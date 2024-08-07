import React, {useEffect} from 'react'
import Header from '../PageHeaders/Header'
import QuestionTag from '../QuestionBlock/QuestionTag.jsx'
import { useLocation, useParams } from 'react-router-dom'

const TagAssociatedQuestionsPage = () => {

  useEffect(() => {
    
    window.scrollTo(top);
  
  }, []);
  
  const tagType = useParams().tagName;


  return (
      <div className='flex flex-col h-max relative left-52 w-[85%] max-[600px]:left-0 max-[600px]:w-full z-0 top-[3.95rem] py-10'>

        <Header heading={`Questions tagged { ${tagType} }`} route={"/ask"} btnText={"Ask Question"} />

        { /* Api call for recieving all questions related to this tag */ }

        <QuestionTag/>
        <QuestionTag/>
        <QuestionTag/>
        <QuestionTag/>
        <QuestionTag/>


    </div>
  )
}

export default TagAssociatedQuestionsPage
