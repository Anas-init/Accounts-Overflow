import axios from "axios";
import { useState } from "react";
const baseUrl ="http://127.0.0.1:8000/api/user/register/"
const Registration = () => {
    const [isValidEmail, setEmail]=useState(false)
    const [isValidpassword, setPassword] = useState(false)
    function emailsetter(){
        setEmail(true)
    }
    function Passwordsetter(){
        setPassword(true)
    }
    const register = async () => {
        await axios.post(baseUrl,{
            email: "xyz@gmail.com",
            name: "xyz",
            password:"12345",
            password2: "12345"
        })
        .then((Response)=>{
            console.log(Response.data)
        });
    }
    return (
        <div>
            <button onClick={register}>SignUp</button>
        </div>

    );
}
 
export default Registration;