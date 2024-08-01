import React from 'react'
import Tag_Header from '../PageHeaders/Tag_Header.jsx'
import Tag from "../Buttons/Tag.jsx"
import { useEffect } from 'react'

const TagCard = ({tagDescription, questionsAskedCount}) => {

  let tagDescrip;
  if(tagDescription.length > 165) {
    tagDescrip = tagDescription.slice(0, 165);
  } else {
    tagDescrip = tagDescription;
  }

  return (

    <div className='max-[1000px]:w-[100%] w-[23.5%] h-max border-2 border-gray-300 p-4 flex flex-col gap-2 rounded-md shadow-xl'>

      <Tag tagName="javascript"/>
      <div className='m-1'>{tagDescrip + " . . ."}</div>
      <div className='m-1'>Questions Asked: <span className='font-semibold'> {questionsAskedCount} </span> </div>
    
    </div>

  )
} 

const TagsPage = () => {

  useEffect(() => {
    
    window.scrollTo(top);
  
  }, [])

  return (
    <div className='max-[980px]:w-full max-[600px]:left-0 max-[600px]:z-10 flex flex-col w-[86%] h-max relative left-52 overflow-x-hidden overflow-y-scroll top-[3.95rem] max-[600px]:top-[5.3rem] pt-4'>
      <Tag_Header/>
      
      <div className='max-[1000px]:flex-col w-[100%] flex flex-wrap gap-4 p-3'>
        
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb"} questionsAskedCount={21587}/>
        
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb djnvie eurbvei veiurbviuw ivuwe wuv ur vwi v8u wur vuw rvuir uv ri tbubwuevnpurheuuunovu3u8tv 3rub uv"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb djnvie eurbvei veiurbviuw ivuwe wuv ur vwi v8u wur vuw rvuir uv ri tbubwuevnpurheuuunovu3u8tv 3rub uv"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb djnvie eurbvei veiurbviuw ivuwe wuv ur vwi v8u wur vuw rvuir uv ri tbubwuevnpurheuuunovu3u8tv 3rub uv"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat officia! Assumenda, atque. ccuyccebeuc ecyb djnvie eurbvei veiurbviuw ivuwe wuv ur vwi v8u wur vuw rvuir uv ri tbubwuevnpurheuuunovu3u8tv 3rub uv"} questionsAskedCount={21587}/>
        
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat"} questionsAskedCount={21587}/>
        <TagCard tagDescription={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui velit molestias quam aut commodi suscipit repellat"} questionsAskedCount={21587}/>
        

      </div>

    </div>
  )
}

export default TagsPage
