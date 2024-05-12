import React from 'react'
import { ChatState } from '../../context/userContext';
import { Box } from "@chakra-ui/react";
import SingleChat from '../singleChat/singleChat';
export default function chatBox() {
    const {user,selectedChat}=ChatState();
  return (
    <Box display={{base:selectedChat?"flex":"none",md:"flex"}}
    alignItems="center"
    flexDir="column"
    p={3}
    bg="white"
    w={{base:"100%",md:"70%"}}  
    borderRadius="lg"
    borderWidth="1px"
    
    >
        <SingleChat></SingleChat>
    </Box>
  )
}
