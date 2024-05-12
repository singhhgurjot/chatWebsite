    import React ,{useEffect, useState,useRef} from 'react'
    import {Box,FormControl,Input,Button,Stack} from "@chakra-ui/react";
    import { ChatState } from '../../context/userContext';
    import axios from '../../axios.js';
    import {toast,ToastContainer} from 'react-toastify';
    import io from 'socket.io-client';
var socket;
    export default function singleChat() {
        const {user,selectedChat,setSelectedChat,status,setStatus}=ChatState();
        const [messages,setMessages]=useState([]);
        const [newMessage,setNewMessage]=useState("");
        const [loading,setLoading]=useState(false);
        const [socketConnected,setSocketConnected]=useState(false);
        const chatBoxRef=useRef(null);
        
        var selectedChatCompare;
        useEffect(() => {
             socket = io("http://localhost:2000");
            socket.emit("setup",user);
            socket.on("connected",()=>{
                setSocketConnected(true);
            })
        },[])
        useEffect(() => {
            fetchMessage();
            selectedChatCompare = selectedChat;

        }
            , [selectedChat])
        useEffect(() => {
            socket.on("message received", (newMessage) => {
                console.log("New Message is", newMessage);
                if (!selectedChatCompare || selectedChatCompare._id != newMessage.chat._id) {
                }
                else {
                    
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                    
                    axios().get("http://localhost:2000/getStatus/" + user).then((res) => {
                        console.log("Status is", res.data.status);
                        if(res.data.status=="busy"){
                            socket.emit("ai message", { chatId: newMessage.chat._id, userId: user, sender: newMessage.sender, theirMessage: newMessage });
                        }
                    })

                    
                }
            })
        })
        const sendMessage=(e)=>{

                axios().post("http://localhost:2000/sendMessage",{chatId:selectedChat._id,senderId:user,content:newMessage}).then((res)=>{
                   
                    console.log("Stored[0]",res.data.data);
                    setMessages([...messages,res.data.data]);
                    setNewMessage("");
                    socket.emit("new message",res.data.data);

                }).catch(err=>{console.log(err)})
        }
    const typingHandler=(e)=>{

    }
        
        const fetchMessage=()=>{
            console.log("useEffect called")
            console.log("Selected Chat is ", selectedChat?._id);
            if (selectedChat) {
                axios().get("http://localhost:2000/getMessages/" + selectedChat?._id).then((res) => {
            
                    setMessages(res.data.data);
                    console.log(selectedChat._id);
                    socket.emit("join chat", selectedChat._id);
                }).catch(err => { console.log(err) })
        }
    }
    
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
                    <Stack overflowY="scroll" ref={chatBoxRef}>
                {messages?.map((message)=>{
                    
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
