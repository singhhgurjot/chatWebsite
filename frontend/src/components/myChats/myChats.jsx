import React, { useEffect,useState } from 'react'
import { ChatState } from '../../context/userContext';
import {Box,Stack} from "@chakra-ui/react";
import axios from 'axios';
import ChatLoading from '../chatLoading/chatLoading';
export default function chatBox() {
    const [loggedInUser, setLoggedInUser] = useState({});   
    const { user,chats,setChats,selectedChat,setSelectedChat } = ChatState();
    const fetchChat=async()=>{
        axios.get(`http://localhost:2000/getChat/${user}`).then(res=>{
            console.log(res.data.data);
            setChats(res.data.data)
        }).catch(err=>{
            toast.error(err.message);
            console.log(err)})
    }
    useEffect(() => {
        setLoggedInUser(localStorage.getItem("id"));
        fetchChat();
    },[])
    return (
       
            <Box display={{base:selectedChat?"none":"flex",md:"flex"}}
                flexDir="column"
                alignItems="center"
                p={3}
                bg="white"
                w={{base:"100%",md:"30%"}}
                borderRadius="lg"
                borderWidth="1px"
            
            >
            
                <Box
                    pb={3}
                    px={3}
                    fontSize={{ base: "28px", md: "30px" }}
                    fontFamily={"Work sans"}
                    display="flex"
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    My Chats
                </Box>
                <Box display="flex"
                flexDir="column"
                p={3}
                bg="#f8f8f8"
                width="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden">
                    {chats?<Stack overflowY="scroll">
{
    chats.map((chat)=>{
        console.log("Chat is" , chat)
        return (
        <Box onClick={()=>{
            setSelectedChat(chat)
                console.log("Hye",chat._id);
            }} 
            cursor="pointer"
                
            bg={selectedChat?._id=== chat._id ? "#f46573" : "#E8E8E8" }
            color={selectedChat?._id=== chat._id ? "white" : "black" }
            px={3}
            py={2}
            borderRadius="lg"
            key={chat._id}
                >
                    <div style={{display:"flex", gap:"10px", alignItems:"center"}}>
                <i className="fa-solid fa-user" ></i>
                  <p>
                    
                   
                    {chat.participants[0] == loggedInUser ? chat.participants[0].username : chat.participants[1].username}
                    <br/>
                    

                    
               </p>
                </div>
        </Box>
        )
    })
}
                    </Stack>:<ChatLoading/>}
                </Box>
            </Box>
      
    
    )
}
