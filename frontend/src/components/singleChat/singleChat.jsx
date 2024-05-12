    import React ,{useEffect, useState} from 'react'
    import {Box,FormControl,Input,Button,Stack} from "@chakra-ui/react";
    import { ChatState } from '../../context/userContext';
    import axios from 'axios';
    import {toast,ToastContainer} from 'react-toastify';
    import io from 'socket.io-client';
    export default function singleChat() {
        const {user,selectedChat,setSelectedChat}=ChatState();
        const [messages,setMessages]=useState([]);
        const [newMessage,setNewMessage]=useState("");
        const [loading,setLoading]=useState(false);
        const [socketConnected,setSocketConnected]=useState(false);
        var socket,selectedChatComapre;
        useEffect(() => {

            socket=io("http://localhost:2000");
            socket.emit("setup",user);
            socket.on("connected",()=>{
                setSocketConnected(true);
            })

        },[])
        const sendMessage=(e)=>{
                axios.post("http://localhost:2000/sendMessage",{chatId:selectedChat._id,senderId:user,content:newMessage}).then((res)=>{
                    console.log("Sender isss is",res.data.data.sender);
                    console.log("Message[0]",messages[0]);
                    console.log("Stored[0]",res.data.data);
                    setMessages([...messages,res.data.data]);
                    setNewMessage("");
                }).catch(err=>{console.log(err)})
        }
    const typingHandler=(e)=>{

    }
        useEffect(() => {
            console.log("Selected Chat is ",selectedChat?._id);
            if(selectedChat){
            axios.get("http://localhost:2000/getMessages/"+selectedChat?._id).then((res)=>{
                console.log("Response is",res);
                setMessages(res.data.data);
                console.log("Message is",res.data.data);
        }).catch(err=>{console.log(err)})
    }}
        , [selectedChat])

        console.log(selectedChat);
    return (
        <>
           
        {selectedChat?(<>
                {/* <Text
                    fontSize={{ base: "28px", md: "30px" }}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="Work sans"
                    d="flex"
                    justifyContent={{ base: "space-between" }}
                    alignItems="center"
                >

                </Text> */}

                {
                
                    selectedChat?.participants[0]?._id===user?selectedChat?.participants[1]?.username.toUpperCase():selectedChat?.participants[0]?.username.toUpperCase()
                    
                
                
                }
                <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    p={3}
                    bg="#E8E8E8"
                    width="100%"
                    height="100%"
                    borderRadius="lg"
                    overflowY="hidden"
                >
                    <Stack overflowY="scroll">
                {messages?.map((message)=>{
                    console.log(message.sender);
                    return (<Box
                        key={message._id}
                        alignSelf={message.sender._id === user || message.sender===user ? "flex-end" : "flex-start"} 
                        bg={message.sender._id === user || message.sender===user? "blue.500" : "gray.300"} 
                        color={message.sender._id === user || message.sender===user? "white" : "black"} 
                        p={2}
                        m={1}
                        borderRadius="md"
                        maxWidth="70%"
                        
                    >
                        {message.content}
                  
                    </Box>)
                    
                })}
                    </Stack>
                <FormControl  isRequired mt={3} display="flex" gap="10px">

                        <Input
                            placeholder="Write a message"
                            bg={'gray.100'}
                            border={0}
                            color={'gray.500'}
                            _placeholder={{
                                color: 'gray.500',
                            }}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button onClick={()=>{
                            sendMessage();
                        }}>
                            Send
                        </Button>
                </FormControl>
                </Box>
        </>):(<Box>
            <h1>Click on a chat to start messaging</h1>
        </Box>)}
        <ToastContainer/>
        </>
    )
    }
