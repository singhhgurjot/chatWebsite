import { useState,useEffect } from 'react'
import {io} from 'socket.io-client'
import axios from "axios"
import './App.css'
import { Route ,Routes} from 'react-router-dom'
import Login from './pages/login/login'
import Register from './pages/register/register'
import Chat from './pages/chat/chat'
function App() {

 
 
  return (
    <>
      <Routes>
    
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  )
}

export default App
