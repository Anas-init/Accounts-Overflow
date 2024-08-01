import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import './index.css'
import QuestionPage from "./assets/Component/Pages/QuestionPage.jsx"
import TagPage from "./assets/Component/Pages/TagsPage.jsx"
import Home from './assets/Component/Pages/HomePage.jsx';
import AskQuestionPage from './assets/Component/Pages/AskQuestionPage.jsx';
import SignIn from './assets/Component/Sign_In_Up/SignIn.jsx';
import SignUp from './assets/Component/Sign_In_Up/SignUp.jsx';
import Sidebar from './assets/Component/SideBarColumn/Sidebar.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {
        path:"",
        element: <> <Sidebar/> <Home/> </>,
      },
      {
        path:"questions",
        element: <> <Sidebar/> <QuestionPage/> </>,
      },
      {
        path:"tagsPage",
        element: <> <Sidebar/> <TagPage/> </>,
      },
      {
        path: "/ask",
        element: <> <Sidebar/> <AskQuestionPage/> </>,
      },
      {
        path:"/signIn",
        element: <> <Sidebar/> <SignIn/> </>,
      },
      {
        path:"/signUp",
        element: <> <Sidebar/> <SignUp/> </>,
      }
    ]
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <RouterProvider router={router} />
  </React.StrictMode>,
)
