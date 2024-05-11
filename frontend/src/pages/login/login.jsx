import axios from 'axios';
import React ,{useState} from 'react'

export default function login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
function submit(){
   axios.post('http://localhost:2000/login',{
    email: email,
    password: password

   }).then((res)=>{
         console.log(res.data)
        localStorage.setItem('token',res.data.token)
        localStorage.setItem('id',res.data.id)
        if(res.status==200){
            window.location.href='/home'
        }
   }).catch((err)=>{


       if(err.response.status === 400){
           console.log("Invalid Credentials")
       }
   }
    )

    console.log("Submitted");
}
  return (
    <div>
        
        <label htmlFor="email">
            email
      <input type="text" placeholder='email' name="email" onChange={(e)=>{
        setEmail(e.target.value)
      }}></input>
          </label>
          <br/>
          <label htmlFor="password">
              Password
              <input type="password" placeholder='password' name="password" onChange={(e) => {
                  setPassword(e.target.value)
              }}></input>
          </label>
          <br></br>
          <button onClick={(e)=>{
            submit();
          }}>Login</button>
    </div>
  )
}
