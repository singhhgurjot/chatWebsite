import { useState,useEffect } from 'react'
import {io} from 'socket.io-client'
import axios from "axios"
import './App.css'
import { Route ,Routes} from 'react-router-dom'
import Socket from './components/sockets/socket'
import Home from './components/home/home'
import Login from './pages/login/login'
function App() {
 
  const socket = io('http://localhost:2000')
  socket.on("message",(data)=>{
    console.log(data);
  })
  return (
    <>
      <Routes>
        <Route  path="/home" element={<Home />} />
        <Route path="/socket" element ={<Socket />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
